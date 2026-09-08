from rest_framework import permissions

class IsCustomAdminUser(permissions.BasePermission):
    """
    Custom permission to only allow access to users with the role of 'Admin' or 'Manager'.
    This overrides Django's default reliance on the 'is_staff' flag.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated and has the correct custom role
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['Admin', 'Manager']
        )
