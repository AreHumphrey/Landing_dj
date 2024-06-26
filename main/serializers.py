from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Review

User = get_user_model()

from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Review

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            name=validated_data['name'],
            email=validated_data['email'],
            password=validated_data['password'],
            username=validated_data['email']  # Use email as default username
        )
        refresh = RefreshToken.for_user(user)
        return user

    def to_representation(self, instance):
        refresh = RefreshToken.for_user(instance)
        return {
            'id': instance.id,
            'name': instance.name,
            'email': instance.email,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'user_name', 'content', 'created_at', 'likes']
        read_only_fields = ['user', 'created_at', 'likes']
