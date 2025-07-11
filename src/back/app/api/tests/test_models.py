import pytest
from django.core.exceptions import ValidationError
from django.utils import timezone
from app.api.models import Supervisor, Employee, LeaveRequest


@pytest.mark.django_db
def test_leave_request_clean_valid():
    supervisor = Supervisor.objects.create(
        email="supervisor@example.com",
        password="testpass123",
        first_name="John",
        last_name="Doe",
        national_id="1111111111",
    )
    employee = Employee.objects.create(
        email="employee@example.com",
        password="testpass123",
        first_name="Jane",
        last_name="Smith",
        national_id="2222222222",
        assigned_supervisor=supervisor,
    )
    start = timezone.now()
    end = start + timezone.timedelta(days=2)
    leave = LeaveRequest(employee=employee, start_date=start, end_date=end)

    # Should not raise ValidationError
    leave.clean()


@pytest.mark.django_db
def test_leave_request_clean_invalid_dates():
    supervisor = Supervisor.objects.create(
        email="supervisor2@example.com",
        password="testpass123",
        first_name="Sup",
        last_name="Two",
        national_id="3333333333",
    )
    employee = Employee.objects.create(
        email="employee2@example.com",
        password="testpass123",
        first_name="Emp",
        last_name="Two",
        national_id="4444444444",
        assigned_supervisor=supervisor,
    )
    start = timezone.now()
    end = start - timezone.timedelta(days=1)  # invalid range
    leave = LeaveRequest(employee=employee, start_date=start, end_date=end)

    with pytest.raises(ValidationError) as excinfo:
        leave.clean()
    assert "End date must be after start date." in str(excinfo.value)


@pytest.mark.django_db
def test_approve_leave_reduces_leave_count():
    supervisor = Supervisor.objects.create(
        email="sup3@example.com",
        password="testpass123",
        first_name="Sup3",
        last_name="Last",
        national_id="5555555555",
    )
    employee = Employee.objects.create(
        email="emp3@example.com",
        password="testpass123",
        first_name="Emp3",
        last_name="Last",
        national_id="6666666666",
        assigned_supervisor=supervisor,
        leave_requests_left=5,
    )
    leave = LeaveRequest.objects.create(
        employee=employee,
        start_date=timezone.now(),
        end_date=timezone.now() + timezone.timedelta(days=2),
    )

    leave.approve_leave()

    leave.refresh_from_db()
    employee.refresh_from_db()
    assert leave.status == LeaveRequest.LeaveStatus.APPROVED
    assert employee.leave_requests_left == 4


@pytest.mark.django_db
def test_approve_leave_no_remaining_days():
    supervisor = Supervisor.objects.create(
        email="sup4@example.com",
        password="testpass123",
        first_name="Sup4",
        last_name="Last",
        national_id="7777777777",
    )
    employee = Employee.objects.create(
        email="emp4@example.com",
        password="testpass123",
        first_name="Emp4",
        last_name="Last",
        national_id="8888888888",
        assigned_supervisor=supervisor,
        leave_requests_left=0,
    )
    leave = LeaveRequest.objects.create(
        employee=employee,
        start_date=timezone.now(),
        end_date=timezone.now() + timezone.timedelta(days=1),
    )

    with pytest.raises(ValidationError) as excinfo:
        leave.approve_leave()
    assert "No leave requests left." in str(excinfo.value)


@pytest.mark.django_db
def test_reject_leave_sets_status():
    supervisor = Supervisor.objects.create(
        email="sup5@example.com",
        password="testpass123",
        first_name="Sup5",
        last_name="Last",
        national_id="9999999999",
    )
    employee = Employee.objects.create(
        email="emp5@example.com",
        password="testpass123",
        first_name="Emp5",
        last_name="Last",
        national_id="0000000000",
        assigned_supervisor=supervisor,
    )
    leave = LeaveRequest.objects.create(
        employee=employee,
        start_date=timezone.now(),
        end_date=timezone.now() + timezone.timedelta(days=1),
    )

    leave.reject_leave()
    leave.refresh_from_db()
    assert leave.status == LeaveRequest.LeaveStatus.REJECTED
