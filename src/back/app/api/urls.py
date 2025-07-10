from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

from .views import (
    EmployeeSignupView,
    EmployeeListView,
    SupervisorSignupView,
    LeaveRequestListView,
    LeaveRequestCreateView,
    LeaveRequestStatusUpdateView,
    UserProfileView,
)

router = routers.DefaultRouter()


urlpatterns = [
    path("", include(router.urls)),
    path("auth/", obtain_auth_token, name="api-token-auth"),
    path(
        "supervisors/signup/", SupervisorSignupView.as_view(), name="supervisor-signup"
    ),
    path("employees/", EmployeeListView.as_view(), name="employee-list"),
    path("employees/signup/", EmployeeSignupView.as_view(), name="employee-signup"),
    path("leave-requests/", LeaveRequestListView.as_view(), name="leave-request-list"),
    path(
        "leave-requests/create/",
        LeaveRequestCreateView.as_view(),
        name="leave-request-create",
    ),
    path(
        "leave-requests/<int:pk>/status/",
        LeaveRequestStatusUpdateView.as_view(),
        name="leave-request-status-update",
    ),
    path("profile/", UserProfileView.as_view(), name="user-profile"),
]
