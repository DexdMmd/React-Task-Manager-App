# api/views.py
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Task, UserProfile
from .serializers import TaskSerializer, UserSerializer, UserProfileSerializer

# For JWT Login
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims if needed
        # token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Add user data to the login response
        serializer = UserSerializer(self.user)
        data['user'] = serializer.data
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return tasks owned by the current user
        return Task.objects.filter(owner=self.request.user).order_by('-createdAt')

    # perform_create is already handled by serializer context to set owner

class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserProfilePictureUpdateView(generics.UpdateAPIView):
    serializer_class = UserProfileSerializer # Simple serializer for profile picture
    permission_classes = [permissions.IsAuthenticated]
    queryset = UserProfile.objects.all() # Required for UpdateAPIView

    def get_object(self):
        # Ensure UserProfile exists, or create if it doesn't (though signal should handle create)
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

    def patch(self, request, *args, **kwargs): # Using PATCH for partial update
        profile = self.get_object()
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Return the updated UserSerializer data, not just profile
            user_serializer = UserSerializer(request.user)
            return Response(user_serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)