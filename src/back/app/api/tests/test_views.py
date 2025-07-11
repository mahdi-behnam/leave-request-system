import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.utils import timezone

from app.api.models import Supervisor, Employee, LeaveRequest


@pytest.mark.django_db
def test_supervisor_signup_view():
    client = APIClient()
    url = reverse("supervisor-signup")
    data = {
        "email": "sup1@example.com",
        "password": "testpass123",
        "first_name": "Sup",
        "last_name": "One",
        "national_id": "1234567890",
        "phone_number": "09121234567",
    }
    response = client.post(url, data)
    assert response.status_code == status.HTTP_201_CREATED
    assert Supervisor.objects.filter(email="sup1@example.com").exists()


@pytest.mark.django_db
def test_employee_signup_by_supervisor():
    # Create supervisor
    supervisor = Supervisor.objects.create_user(
        email="sup2@example.com",
        password="testpass123",
        first_name="Sup",
        last_name="Two",
        national_id="2222222222",
    )

    # Auth as supervisor
    client = APIClient()
    response = client.post(
        "/api/auth/", {"username": "sup2@example.com", "password": "testpass123"}
    )
    token = response.data["token"]
    client.credentials(HTTP_AUTHORIZATION="Token " + token)

    url = reverse("employee-signup")
    data = {
        "email": "emp1@example.com",
        "password": "empass123",
        "first_name": "Emp",
        "last_name": "One",
        "national_id": "3333333333",
        "phone_number": "09111111111",
    }
    response = client.post(url, data)
    assert response.status_code == status.HTTP_201_CREATED
    assert Employee.objects.filter(email="emp1@example.com").exists()


@pytest.mark.django_db
def test_employee_create_leave_request():
    supervisor = Supervisor.objects.create_user(
        email="sup3@example.com", password="sup3pass", national_id="9999999991"
    )
    employee = Employee.objects.create_user(
        email="emp2@example.com",
        password="emppass",
        national_id="8888888888",
        assigned_supervisor=supervisor,
    )

    # Auth as employee
    client = APIClient()
    response = client.post(
        "/api/auth/", {"username": "emp2@example.com", "password": "emppass"}
    )
    token = response.data["token"]
    client.credentials(HTTP_AUTHORIZATION="Token " + token)

    url = reverse("leave-request-create")
    start = timezone.now()
    end = start + timezone.timedelta(days=2)

    data = {
        "start_date": start.isoformat(),
        "end_date": end.isoformat(),
        "reason": "Vacation",
    }

    response = client.post(url, data, format="json")
    assert response.status_code == status.HTTP_201_CREATED
    assert LeaveRequest.objects.filter(employee=employee).exists()


@pytest.mark.django_db
def test_supervisor_can_view_assigned_employee_requests():
    supervisor = Supervisor.objects.create_user(
        email="sup4@example.com", password="sup4pass", national_id="7777777777"
    )
    employee = Employee.objects.create_user(
        email="emp3@example.com",
        password="emppass",
        national_id="6666666666",
        assigned_supervisor=supervisor,
    )
    LeaveRequest.objects.create(
        employee=employee,
        start_date=timezone.now(),
        end_date=timezone.now() + timezone.timedelta(days=1),
    )

    # Auth as supervisor
    client = APIClient()
    response = client.post(
        "/api/auth/", {"username": "sup4@example.com", "password": "sup4pass"}
    )
    token = response.data["token"]
    client.credentials(HTTP_AUTHORIZATION="Token " + token)

    url = reverse("leave-request-list")
    response = client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1


@pytest.mark.django_db
def test_supervisor_can_approve_leave_request():
    supervisor = Supervisor.objects.create_user(
        email="sup5@example.com", password="sup5pass", national_id="1111111111"
    )
    employee = Employee.objects.create_user(
        email="emp5@example.com",
        password="emppass",
        national_id="2222222222",
        assigned_supervisor=supervisor,
    )

    leave = LeaveRequest.objects.create(
        employee=employee,
        start_date=timezone.now(),
        end_date=timezone.now() + timezone.timedelta(days=1),
    )

    client = APIClient()
    response = client.post(
        "/api/auth/", {"username": "sup5@example.com", "password": "sup5pass"}
    )
    token = response.data["token"]
    client.credentials(HTTP_AUTHORIZATION="Token " + token)

    url = reverse("leave-request-status-update", kwargs={"pk": leave.pk})
    response = client.put(url, {"status": "approved"}, format="json")

    assert response.status_code == status.HTTP_200_OK
    leave.refresh_from_db()
    assert leave.status == LeaveRequest.LeaveStatus.APPROVED


@pytest.mark.django_db
def test_cannot_approve_already_approved_request():
    supervisor = Supervisor.objects.create_user(
        email="sup6@example.com", password="sup6pass", national_id="3333333333"
    )
    employee = Employee.objects.create_user(
        email="emp6@example.com",
        password="emppass",
        national_id="4444444444",
        assigned_supervisor=supervisor,
    )

    leave = LeaveRequest.objects.create(
        employee=employee,
        start_date=timezone.now(),
        end_date=timezone.now() + timezone.timedelta(days=1),
        status=LeaveRequest.LeaveStatus.APPROVED,
    )

    client = APIClient()
    response = client.post(
        "/api/auth/", {"username": "sup6@example.com", "password": "sup6pass"}
    )
    token = response.data["token"]
    client.credentials(HTTP_AUTHORIZATION="Token " + token)

    url = reverse("leave-request-status-update", kwargs={"pk": leave.pk})
    response = client.put(url, {"status": "rejected"}, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "not pending" in response.data["detail"].lower()


@pytest.mark.django_db
def test_employee_cannot_approve_leave_request():
    supervisor = Supervisor.objects.create_user(
        email="sup7@example.com", password="sup7pass", national_id="5555555555"
    )
    employee = Employee.objects.create_user(
        email="emp7@example.com",
        password="emppass",
        national_id="6666666666",
        assigned_supervisor=supervisor,
    )

    leave = LeaveRequest.objects.create(
        employee=employee,
        start_date=timezone.now(),
        end_date=timezone.now() + timezone.timedelta(days=1),
    )

    client = APIClient()
    response = client.post(
        "/api/auth/", {"username": "emp7@example.com", "password": "emppass"}
    )
    token = response.data["token"]
    client.credentials(HTTP_AUTHORIZATION="Token " + token)

    url = reverse("leave-request-status-update", kwargs={"pk": leave.pk})
    response = client.put(url, {"status": "approved"}, format="json")

    assert response.status_code == status.HTTP_403_FORBIDDEN
