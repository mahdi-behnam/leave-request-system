from rest_framework.permissions import BasePermission


class IsSuperuserOrSupervisor(BasePermission):
    """
    Allows access only to superusers and users of type Supervisor.
    """

    def has_permission(self, request, view):
        user = request.user
        return (
            user
            and user.is_authenticated
            and (user.is_superuser or user.is_supervisor())
        )


class IsSuperuserOrEmployee(BasePermission):
    """
    Allows access only to superusers and users of type Employee.
    """

    def has_permission(self, request, view):
        user = request.user
        return (
            user and user.is_authenticated and (user.is_superuser or user.is_employee())
        )
