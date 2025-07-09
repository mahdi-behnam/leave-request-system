from rest_framework import serializers
from app.api.models import Supervisor, Employee, LeaveRequest


class SupervisorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supervisor
        fields = [
            "id",
            "date_joined",
            "email",
            "first_name",
            "last_name",
            "national_id",
            "phone_number",
        ]


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = [
            "id",
            "date_joined",
            "email",
            "first_name",
            "last_name",
            "national_id",
            "phone_number",
            "assigned_supervisor",
            "leave_requests_left",
        ]


class LeaveRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveRequest
        # fields = ["id", "employee", "start_date", "end_date", "reason", "status"]
        fields = "__all__"
