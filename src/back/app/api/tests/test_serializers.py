import pytest
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from app.api.models import Supervisor, Employee, LeaveRequest
from app.api.serializers import (
    SupervisorSignupSerializer,
    EmployeeSignupSerializer,
    LeaveRequestSerializer,
    LeaveRequestStatusUpdateSerializer,
)


@pytest.mark.django_db
def test_supervisor_signup_serializer_creates_user():
    data = {
        "email": "sup@example.com",
        "password": "securepass123",
        "first_name": "John",
        "last_name": "Doe",
        "national_id": "1234567890",
        "phone_number": "09123456789",
    }

    serializer = SupervisorSignupSerializer(data=data)
    assert serializer.is_valid(), serializer.errors

    user = serializer.save()
    assert Supervisor.objects.filter(email="sup@example.com").exists()
    assert user.check_password("securepass123")


@pytest.mark.django_db
def test_employee_signup_serializer_creates_user():
    data = {
        "email": "emp@example.com",
        "password": "securepass456",
        "first_name": "Jane",
        "last_name": "Smith",
        "national_id": "0987654321",
        "phone_number": "09987654321",
    }

    serializer = EmployeeSignupSerializer(data=data)
    assert serializer.is_valid(), serializer.errors

    employee = serializer.save()
    assert Employee.objects.filter(email="emp@example.com").exists()
    assert employee.check_password("securepass456")
    assert employee.leave_requests_left == 30


@pytest.mark.django_db
def test_leave_request_serializer_valid_dates():
    supervisor = Supervisor.objects.create(
        email="sup@ex.com",
        password="xpass",
        first_name="Sup",
        last_name="One",
        national_id="1111222233",
    )
    employee = Employee.objects.create(
        email="emp@ex.com",
        password="xpass",
        first_name="Emp",
        last_name="One",
        national_id="3333444455",
        assigned_supervisor=supervisor,
    )
    start = timezone.now()
    end = start + timezone.timedelta(days=1)

    data = {
        "employee": employee.id,
        "start_date": start,
        "end_date": end,
        "reason": "Vacation",
    }

    serializer = LeaveRequestSerializer(data=data)
    assert serializer.is_valid(), serializer.errors


@pytest.mark.django_db
def test_leave_request_serializer_invalid_dates():
    start = timezone.now()
    end = start - timezone.timedelta(days=1)

    data = {
        "start_date": start,
        "end_date": end,
    }

    serializer = LeaveRequestSerializer(data=data)
    assert not serializer.is_valid()
    assert "start_date" in serializer.errors


def test_leave_request_status_update_serializer_valid():
    data = {"status": LeaveRequest.LeaveStatus.APPROVED}
    serializer = LeaveRequestStatusUpdateSerializer(data=data)
    assert serializer.is_valid()
