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


class SupervisorSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Supervisor
        fields = [
            "email",
            "password",
            "first_name",
            "last_name",
            "national_id",
            "phone_number",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")
        supervisor = Supervisor(**validated_data)
        supervisor.set_password(password)
        supervisor.save()
        return supervisor


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


class EmployeeSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Employee
        fields = [
            "email",
            "password",
            "first_name",
            "last_name",
            "national_id",
            "phone_number",
            "leave_requests_left",
        ]
        extra_kwargs = {"leave_requests_left": {"default": 30}}

    def create(self, validated_data):
        password = validated_data.pop("password")
        employee = Employee(**validated_data)
        employee.set_password(password)
        employee.save()
        return employee


class LeaveRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveRequest
        # fields = ["id", "employee", "start_date", "end_date", "reason", "status"]
        fields = "__all__"
