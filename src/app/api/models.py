from django.db import models


class Supervisor(models.Model):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=80)
    last_name = models.CharField(max_length=100)
    national_id = models.CharField(max_length=10, unique=True)
    phone_number = models.CharField(max_length=11, blank=True, null=True)
    member_since = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.first_name + " " + self.last_name

    class Meta:
        verbose_name = "Supervisor"
        verbose_name_plural = "Supervisors"
        ordering = ["member_since"]


class Employee(models.Model):
    supervisor = models.ForeignKey(
        Supervisor, on_delete=models.SET_NULL, related_name="employees"
    )
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=80)
    last_name = models.CharField(max_length=100)
    national_id = models.CharField(max_length=10, unique=True)
    phone_number = models.CharField(max_length=11, blank=True, null=True)
    member_since = models.DateField(auto_now_add=True)
    leave_requests_left = models.IntegerField(default=30)

    def __str__(self):
        return self.first_name + " " + self.last_name

    class Meta:
        verbose_name = "Employee"
        verbose_name_plural = "Employees"
        ordering = ["member_since"]


class LeaveRequest(models.Model):
    employee = models.ForeignKey(
        Employee, on_delete=models.CASCADE, related_name="leave_requests"
    )
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("approved", "Approved"),
            ("rejected", "Rejected"),
        ],
        default="pending",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee.first_name} {self.employee.last_name} --- {self.start_date}-{self.end_date} --- {self.status}"

    class Meta:
        verbose_name = "Leave Request"
        verbose_name_plural = "Leave Requests"
        ordering = ["created_at"]
