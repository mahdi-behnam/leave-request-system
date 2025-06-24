from rest_framework import permissions, viewsets

from app.api.models import Supervisor, Employee, LeaveRequest
from app.api.serializers import (
    SupervisorSerializer,
    EmployeeSerializer,
    LeaveRequestSerializer,
)


class SupervisorViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows supervisors to be viewed or edited.
    """

    queryset = Supervisor.objects.all()
    serializer_class = SupervisorSerializer
    permission_classes = [permissions.IsAuthenticated]


class EmployeeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows employees to be viewed or edited.
    """

    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.IsAuthenticated]


class LeaveRequestViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows leave requests to be viewed or edited.
    """

    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(employee=self.request.user.employee)
