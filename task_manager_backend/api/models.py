# api/models.py
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone # For createdAt default

# To store custom user attributes like profile picture and isAdmin flag
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    # The 'isAdmin' concept is usually handled by Django's is_staff or is_superuser flags,
    # or by using Django's groups and permissions system.
    # If you have a specific 'isAdmin' not covered by Django's built-ins, you can add it here.
    # is_admin_custom = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

    @property
    def profile_picture_url(self):
        if self.profile_picture and hasattr(self.profile_picture, 'url'):
            return self.profile_picture.url
        return None

# Ensure UserProfile is created when a User is created (using signals)
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    instance.profile.save()


class Task(models.Model):
    TASK_STATUS_CHOICES = [
        ('To Do', 'To Do'),
        ('In Progress', 'In Progress'),
        ('Done', 'Done'),
        ('Blocked', 'Blocked'),
    ]
    TASK_CATEGORY_CHOICES = [
        ('Work', 'Work'),
        ('Personal', 'Personal'),
        ('Study', 'Study'),
        ('Shopping', 'Shopping'),
        ('Other', 'Other'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=200)
    description = models.TextField()
    startTime = models.DateTimeField(null=True, blank=True)
    endTime = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=TASK_STATUS_CHOICES, default='To Do')
    category = models.CharField(max_length=20, choices=TASK_CATEGORY_CHOICES, default='Personal')
    completed = models.BooleanField(default=False)
    # assignedUsers: This can be a ManyToManyField if you want to assign tasks to multiple users.
    # For simplicity, if it's just a text field of names/groups as in your frontend, use CharField.
    # If you want to link to actual User objects:
    # assigned_users_objects = models.ManyToManyField(User, related_name='assigned_tasks', blank=True)
    assignedUsers = models.CharField(max_length=255, blank=True, null=True) # For comma-separated strings
    createdAt = models.DateTimeField(default=timezone.now)
    isUrgent = models.BooleanField(default=False)

    def __str__(self):
        return self.title