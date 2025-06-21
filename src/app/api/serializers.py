from rest_framework import serializers


class SupervisorSerializer(serializers.ModelSerializer):
    class Meta:
        model = "app.api.models.Supervisor"
        fields = "__all__"


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = "app.api.models.Employee"
        fields = "__all__"


class LeaveRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = "app.api.models.LeaveRequest"
        fields = "__all__"
