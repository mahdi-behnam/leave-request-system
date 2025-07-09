from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

from app.api.managers import UserManager


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=80)
    last_name = models.CharField(max_length=100)
    national_id = models.CharField(max_length=10, unique=True)
    phone_number = models.CharField(max_length=11, blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  # List of fields required by createsuperuser command

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["date_joined"]

    def is_supervisor(self):
        return isinstance(self, Supervisor)

    def is_employee(self):
        return isinstance(self, Employee)

    def is_employee_or_supervisor(self):
        return self.is_employee() or self.is_supervisor()

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = self.first_name + " " + self.last_name
        return full_name.strip()


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
