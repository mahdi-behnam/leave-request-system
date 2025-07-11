import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.utils import timezone

from app.api.models import Employee, LeaveRequest, Supervisor


@pytest.mark.django_db
def test_full_leave_request_approval_flow():
    client = APIClient()

    # 1. Supervisor signs up
    sup_data = {
        "email": "sup_int@example.com",
        "password": "supsecure123",
        "first_name": "IntSup",
        "last_name": "User",
        "national_id": "1111111100",
        "phone_number": "09120000000",
    }
    response = client.post("/api/supervisors/signup/", sup_data)
    assert response.status_code == status.HTTP_201_CREATED

    # 2. Supervisor logs in
    login = client.post(
        "/api/auth/", {"username": sup_data["email"], "password": sup_data["password"]}
    )
    token = login.data["token"]
    client.credentials(HTTP_AUTHORIZATION="Token " + token)

    # 3. Supervisor creates employee
    emp_data = {
        "email": "emp_int@example.com",
        "password": "empsecure123",
        "first_name": "IntEmp",
        "last_name": "User",
        "national_id": "2222222200",
        "phone_number": "09330000000",
    }
    response = client.post("/api/employees/signup/", emp_data)
    assert response.status_code == status.HTTP_201_CREATED

    # 4. Employee logs in
    client.credentials()  # remove old token
    login = client.post(
        "/api/auth/", {"username": emp_data["email"], "password": emp_data["password"]}
    )
    emp_token = login.data["token"]
    client.credentials(HTTP_AUTHORIZATION="Token " + emp_token)

    # 5. Employee submits leave request
    start = timezone.now()
    end = start + timezone.timedelta(days=3)
    leave_data = {
        "start_date": start.isoformat(),
        "end_date": end.isoformat(),
        "reason": "Integration Test Vacation",
    }
    response = client.post("/api/leave-requests/create/", leave_data, format="json")
    assert response.status_code == status.HTTP_201_CREATED
    leave_id = response.data["id"]

    # 6. Supervisor logs back in to approve
    client.credentials()
    login = client.post(
        "/api/auth/", {"username": sup_data["email"], "password": sup_data["password"]}
    )
    sup_token = login.data["token"]
    client.credentials(HTTP_AUTHORIZATION="Token " + sup_token)

    response = client.put(
        f"/api/leave-requests/{leave_id}/status/", {"status": "approved"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.data["status"] == "approved"


@pytest.mark.django_db
def test_full_leave_request_rejection_flow():
    client = APIClient()

    # 1. Supervisor signs up
    sup_data = {
        "email": "sup_rej@example.com",
        "password": "supreject123",
        "first_name": "RejectSup",
        "last_name": "User",
        "national_id": "5555555500",
        "phone_number": "09129999999",
    }
    response = client.post("/api/supervisors/signup/", sup_data)
    assert response.status_code == status.HTTP_201_CREATED

    # 2. Supervisor logs in
    login = client.post(
        "/api/auth/", {"username": sup_data["email"], "password": sup_data["password"]}
    )
    token = login.data["token"]
    client.credentials(HTTP_AUTHORIZATION="Token " + token)

    # 3. Supervisor creates employee
    emp_data = {
        "email": "emp_rej@example.com",
        "password": "empreject123",
        "first_name": "RejectEmp",
        "last_name": "User",
        "national_id": "6666666600",
        "phone_number": "09335555555",
    }
    response = client.post("/api/employees/signup/", emp_data)
    assert response.status_code == status.HTTP_201_CREATED

    # 4. Employee logs in
    client.credentials()
    login = client.post(
        "/api/auth/", {"username": emp_data["email"], "password": emp_data["password"]}
    )
    emp_token = login.data["token"]
    client.credentials(HTTP_AUTHORIZATION="Token " + emp_token)

    # 5. Employee submits leave request
    start = timezone.now()
    end = start + timezone.timedelta(days=2)
    leave_data = {
        "start_date": start.isoformat(),
        "end_date": end.isoformat(),
        "reason": "Need a break",
    }
    response = client.post("/api/leave-requests/create/", leave_data, format="json")
    assert response.status_code == status.HTTP_201_CREATED
    leave_id = response.data["id"]

    # 6. Supervisor logs back in to reject
    client.credentials()
    login = client.post(
        "/api/auth/", {"username": sup_data["email"], "password": sup_data["password"]}
    )
    sup_token = login.data["token"]
    client.credentials(HTTP_AUTHORIZATION="Token " + sup_token)

    response = client.put(
        f"/api/leave-requests/{leave_id}/status/", {"status": "rejected"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.data["status"] == "rejected"

    # 7. Confirm employee still has 30 leave days
    from app.api.models import Employee

    employee = Employee.objects.get(email=emp_data["email"])
    assert employee.leave_requests_left == 30


@pytest.mark.django_db
def test_employee_can_delete_pending_leave():
    # Setup supervisor and employee
    from app.api.models import LeaveRequest

    supervisor = Supervisor.objects.create_user(
        email="sup_del1@example.com", password="pass", national_id="1110000001"
    )
    employee = Employee.objects.create_user(
        email="emp_del1@example.com",
        password="pass",
        national_id="2220000001",
        assigned_supervisor=supervisor,
    )

    # Create a pending leave
    leave = LeaveRequest.objects.create(
        employee=employee,
        start_date=timezone.now(),
        end_date=timezone.now() + timezone.timedelta(days=1),
        status=LeaveRequest.LeaveStatus.PENDING,
    )

    # Login as employee
    client = APIClient()
    login = client.post(
        "/api/auth/", {"username": "emp_del1@example.com", "password": "pass"}
    )
    token = login.data["token"]
    client.credentials(HTTP_AUTHORIZATION="Token " + token)

    # Delete leave
    response = client.delete(f"/api/leave-requests/{leave.pk}/delete/")
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not LeaveRequest.objects.filter(pk=leave.pk).exists()


@pytest.mark.django_db
def test_employee_cannot_delete_approved_leave():
    from app.api.models import LeaveRequest

    supervisor = Supervisor.objects.create_user(
        email="sup_del2@example.com", password="pass", national_id="1110000002"
    )
    employee = Employee.objects.create_user(
        email="emp_del2@example.com",
        password="pass",
        national_id="2220000002",
        assigned_supervisor=supervisor,
    )

    leave = LeaveRequest.objects.create(
        employee=employee,
        start_date=timezone.now(),
        end_date=timezone.now() + timezone.timedelta(days=2),
        status=LeaveRequest.LeaveStatus.APPROVED,
    )

    client = APIClient()
    login = client.post(
        "/api/auth/", {"username": "emp_del2@example.com", "password": "pass"}
    )
    token = login.data["token"]
    client.credentials(HTTP_AUTHORIZATION="Token " + token)

    response = client.delete(f"/api/leave-requests/{leave.pk}/delete/")
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert LeaveRequest.objects.filter(pk=leave.pk).exists()


@pytest.mark.django_db
def test_employee_cannot_delete_others_leave():
    supervisor = Supervisor.objects.create_user(
        email="sup_del3@example.com", password="pass", national_id="1110000003"
    )
    emp1 = Employee.objects.create_user(
        email="emp_del3a@example.com",
        password="pass",
        national_id="2220000003",
        assigned_supervisor=supervisor,
    )
    emp2 = Employee.objects.create_user(
        email="emp_del3b@example.com",
        password="pass",
        national_id="2220000004",
        assigned_supervisor=supervisor,
    )

    leave = LeaveRequest.objects.create(
        employee=emp1,
        start_date=timezone.now(),
        end_date=timezone.now() + timezone.timedelta(days=2),
        status=LeaveRequest.LeaveStatus.PENDING,
    )

    client = APIClient()
    login = client.post(
        "/api/auth/", {"username": "emp_del3b@example.com", "password": "pass"}
    )
    token = login.data["token"]
    client.credentials(HTTP_AUTHORIZATION="Token " + token)

    response = client.delete(f"/api/leave-requests/{leave.pk}/delete/")
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert LeaveRequest.objects.filter(pk=leave.pk).exists()
