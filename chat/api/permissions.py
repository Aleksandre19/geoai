from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj.user 
    

class IsSuperUserOrReadOnly(permissions.BasePermission):
    
    def has_permission(self,request, view):
        if request.method in permissions.SAFE_METHODS:
            return True       
        return request.user.is_superuser
    
    def has_object_permission(self, request, views, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_superuser
