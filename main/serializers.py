from rest_framework import serializers
from django.contrib.auth import get_user_model
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
        return user

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'user', 'content', 'created_at']
        read_only_fields = ['user', 'created_at']
