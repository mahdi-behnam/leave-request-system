from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Supervisor, Employee, LeaveRequest


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "national_id",
        "phone_number",
        "is_staff",
        "is_active",
    )
    list_filter = ("is_staff", "is_active")
    search_fields = ("username", "email", "first_name", "last_name", "national_id")
    ordering = ("date_joined",)
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (
            "Personal Info",
            {
                "fields": (
                    "email",
                    "first_name",
                    "last_name",
                    "national_id",
                    "phone_number",
                )
            },
        ),
        (
            "Permissions",
            {"fields": ("is_staff", "is_active", "groups", "user_permissions")},
        ),
        ("Important Dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "username",
                    "email",
                    "password1",
                    "password2",
                    "first_name",
                    "last_name",
                    "national_id",
                    "phone_number",
                    "is_staff",
                    "is_active",
                ),
            },
        ),
    )


@admin.register(Supervisor)
class SupervisorAdmin(CustomUserAdmin):
    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "national_id",
        "phone_number",
        "is_staff",
        "is_active",
    )


@admin.register(Employee)
class EmployeeAdmin(CustomUserAdmin):
    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "national_id",
        "phone_number",
        "assigned_supervisor",
        "leave_requests_left",
        "is_staff",
        "is_active",
    )
    list_filter = ("assigned_supervisor", "is_staff", "is_active")
    search_fields = (
        "username",
        "email",
        "first_name",
        "last_name",
        "national_id",
        "assigned_supervisor__username",
    )
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (
            "Personal Info",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "email",
                    "national_id",
                    "phone_number",
                    "assigned_supervisor",
                    "leave_requests_left",
                )
            },
        ),
        (
            "Permissions",
            {"fields": ("is_staff", "is_active", "groups", "user_permissions")},
        ),
        ("Important Dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "username",
                    "email",
                    "password1",
                    "password2",
                    "first_name",
                    "last_name",
                    "national_id",
                    "phone_number",
                    "assigned_supervisor",
                    "leave_requests_left",
                ),
            },
        ),
    )


@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = (
        "employee",
        "start_date",
        "end_date",
        "reason",
        "status",
        "created_at",
    )
    list_filter = ("status", "created_at")
    search_fields = (
        "employee__username",
        "employee__first_name",
        "employee__last_name",
        "reason",
    )
    ordering = ("created_at",)
    readonly_fields = ("created_at",)
