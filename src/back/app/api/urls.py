from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

from .views import (
    EmployeeSignupView,
    EmployeeListView,
    SupervisorSignupView,
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
]
