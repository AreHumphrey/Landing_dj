from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Review

User = get_user_model()


# Сериализатор для модели пользователя
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Создание нового пользователя
        user = User.objects.create_user(
            name=validated_data['name'],
            email=validated_data['email'],
            password=validated_data['password'],
            username=validated_data['email']  # Использование email в качестве имени пользователя
        )
        return user

    def to_representation(self, instance):
        # Представление данных пользователя вместе с JWT-токенами
        refresh = RefreshToken.for_user(instance)
        return {
            'id': instance.id,
            'name': instance.name,
            'email': instance.email,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


# Сериализатор для модели отзывов
class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'user_name', 'content', 'created_at', 'likes']
        read_only_fields = ['user', 'created_at', 'likes']
