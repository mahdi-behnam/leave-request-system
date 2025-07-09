from rest_framework import permissions, viewsets, generics
from rest_framework.permissions import IsAuthenticated

from .models import Supervisor, Employee, LeaveRequest
from .serializers import (
    EmployeeSerializer,
)
from .permissions import IsSuperuserOrSupervisor


class EmployeeCreateView(generics.CreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, IsSuperuserOrSupervisor]

    def perform_create(self, serializer):
        if self.request.user.is_superuser():
            serializer.save(assigned_supervisor=self.request.user)
        else:
            serializer.save()


class EmployeeListView(generics.ListAPIView):
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, IsSuperuserOrSupervisor]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Employee.objects.all()
        elif user.is_supervisor() == "Supervisor":
            return Employee.objects.filter(assigned_supervisor=user)
        return Employee.objects.none()
