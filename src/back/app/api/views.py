from rest_framework import permissions, viewsets, generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Supervisor, Employee, LeaveRequest
from .serializers import (
    EmployeeSerializer,
    EmployeeSignupSerializer,
    LeaveRequestSerializer,
    SupervisorSignupSerializer,
)
from .permissions import IsSuperuserOrEmployee, IsSuperuserOrSupervisor


class SupervisorSignupView(generics.CreateAPIView):
    queryset = Supervisor.objects.all()
    serializer_class = SupervisorSignupSerializer
    permission_classes = [AllowAny]


class EmployeeSignupView(generics.CreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSignupSerializer
    permission_classes = [IsAuthenticated, IsSuperuserOrSupervisor]

    def perform_create(self, serializer):
        if self.request.user.is_supervisor():
            supervisor = self.request.user.get_subclass_instance()
            serializer.save(assigned_supervisor=supervisor)
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


class LeaveRequestCreateView(generics.CreateAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated, IsSuperuserOrEmployee]

    def perform_create(self, serializer):
        if self.request.user.is_employee():
            employee = self.request.user.get_subclass_instance()
            serializer.save(employee=employee)
        else:
            serializer.save()


class LeaveRequestListView(generics.ListAPIView):
    queryset = LeaveRequest.objects.none()  # default fallback
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.is_superuser:
            return LeaveRequest.objects.all()

        elif user.is_supervisor():
            supervisor = user.get_subclass_instance()
            return LeaveRequest.objects.filter(employee__assigned_supervisor=supervisor)

        elif user.is_employee():
            employee = user.get_subclass_instance()
            return LeaveRequest.objects.filter(employee=employee)

        return LeaveRequest.objects.none()
