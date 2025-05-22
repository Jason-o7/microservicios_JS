from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if not hasattr(request, 'user') or not request.user:
            return False

        if request.method in permissions.SAFE_METHODS:
            return True
        
        return getattr(request.user, 'role', None) == 'admin' 