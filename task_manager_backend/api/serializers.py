# api/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Task, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture_url = serializers.CharField(source='profile_picture.url', read_only=True, allow_null=True)
    class Meta:
        model = UserProfile
        fields = ['profile_picture', 'profile_picture_url'] # 'profile_picture' for upload


class UserSerializer(serializers.ModelSerializer):
    # Use the custom name from your User type on the frontend
    name = serializers.CharField(source='get_full_name', read_only=True) # or 'username' or first_name/last_name
    profile_picture_url = serializers.SerializerMethodField()
    isAdmin = serializers.BooleanField(source='is_staff') # Map Django's is_staff to isAdmin

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'profile_picture_url', 'isAdmin']

    def get_profile_picture_url(self, obj):
        try:
            return obj.profile.profile_picture.url if obj.profile.profile_picture else None
        except UserProfile.DoesNotExist:
            return None

class TaskSerializer(serializers.ModelSerializer):
    # If you want to show owner details beyond just the ID
    # owner = UserSerializer(read_only=True)
    # owner_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='owner', write_only=True)

    class Meta:
        model = Task
        fields = '__all__' # Or list specific fields: ['id', 'title', 'description', ...]
        read_only_fields = ['owner', 'createdAt'] # Owner will be set automatically

    def create(self, validated_data):
        # Set owner automatically to the request user during creation
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)