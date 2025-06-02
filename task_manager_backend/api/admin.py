# api/admin.py
from django.contrib import admin
from .models import Task, UserProfile
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'

class CustomUserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_profile_picture_url_admin')
    
    def get_profile_picture_url_admin(self, instance):
        if instance.profile and instance.profile.profile_picture:
            return instance.profile.profile_picture.url
        return "No Picture"
    get_profile_picture_url_admin.short_description = 'Profile Picture URL'


admin.site.unregister(User) # Unregister base User admin
admin.site.register(User, CustomUserAdmin) # Register User admin with inline profile
admin.site.register(Task)
admin.site.register(UserProfile) # You can also register UserProfile directly for more control