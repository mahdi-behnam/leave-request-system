from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=80)
    last_name = models.CharField(max_length=100)
    national_id = models.CharField(max_length=10, unique=True)
    phone_number = models.CharField(max_length=11, blank=True, null=True)

    def __str__(self):
        return self.first_name + " " + self.last_name

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["date_joined"]


class Supervisor(CustomUser):

    class Meta:
        verbose_name = "Supervisor"
        verbose_name_plural = "Supervisors"
        ordering = ["date_joined"]


class Employee(CustomUser):
    assigned_supervisor = models.ForeignKey(
        Supervisor,
        on_delete=models.SET_NULL,
        null=True,
        blank=False,
        related_name="employees",
    )
    leave_requests_left = models.IntegerField(default=30)

    class Meta:
        verbose_name = "Employee"
        verbose_name_plural = "Employees"
        ordering = ["date_joined"]


class LeaveRequest(models.Model):
    class LeaveStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    employee = models.ForeignKey(
        Employee, on_delete=models.CASCADE, related_name="leave_requests"
    )
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=LeaveStatus.choices,
        default=LeaveStatus.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def approve_leave(self):
        if self.employee.leave_requests_left > 0:
            self.employee.leave_requests_left -= 1
            self.employee.save()
            self.status = self.LeaveStatus.APPROVED
            self.save()
        else:
            raise ValidationError("No leave requests left.")

    def reject_leave(self):
        self.status = self.LeaveStatus.REJECTED
        self.save()

    def clean(self):
        if self.end_date <= self.start_date:
            raise ValidationError("End date must be after start date.")
        overlapping_requests = LeaveRequest.objects.filter(
            employee=self.employee,
            start_date__lte=self.end_date,
            end_date__gte=self.start_date,
        ).exclude(pk=self.pk)
        if overlapping_requests.exists():
            raise ValidationError("Leave request overlaps with an existing request.")

    def __str__(self):
        return f"{self.employee.first_name} {self.employee.last_name} --- {self.start_date}-{self.end_date} --- {self.status}"

    class Meta:
        verbose_name = "Leave Request"
        verbose_name_plural = "Leave Requests"
        ordering = ["created_at"]
