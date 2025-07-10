from rest_framework import permissions, viewsets, generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied

from .models import Supervisor, Employee, LeaveRequest
from .serializers import (
    EmployeeSerializer,
    EmployeeSignupSerializer,
    LeaveRequestSerializer,
    SupervisorSerializer,
    SupervisorSignupSerializer,
    LeaveRequestStatusUpdateSerializer,
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


class LeaveRequestStatusUpdateView(generics.UpdateAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestStatusUpdateSerializer
    permission_classes = [IsSuperuserOrSupervisor]

    def get_object(self):
        leave_request = super().get_object()
        user = self.request.user

        if user.is_superuser:
            return leave_request

        # If supervisor, ensure the leave request belongs to their employee
        if user.is_supervisor():
            supervisor = user.get_subclass_instance()
            if leave_request.employee.assigned_supervisor == supervisor:
                return leave_request

        raise PermissionDenied(
            "You don't have permission to modify this leave request."
        )

    def update(self, request, *args, **kwargs):
        leave_request = self.get_object()
        new_status = request.data.get("status")

        if leave_request.status != LeaveRequest.LeaveStatus.PENDING:
            return Response(
                {"detail": "Leave request is not pending."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_status == LeaveRequest.LeaveStatus.APPROVED:
            leave_request.approve_leave()
        elif new_status == LeaveRequest.LeaveStatus.REJECTED:
            leave_request.reject_leave()
        else:
            return Response(
                {"detail": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(leave_request)
        return Response(serializer.data)


class UserProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        subclass_instance = user.get_subclass_instance()

        if user.is_employee():
            serializer = EmployeeSerializer(subclass_instance)
        elif user.is_supervisor():
            serializer = SupervisorSerializer(subclass_instance)
        else:
            raise PermissionDenied(
                "Only employees and supervisors can access this endpoint."
            )

        return Response(serializer.data)
