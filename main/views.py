from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from rest_framework import generics, permissions, serializers
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from drf_yasg.utils import swagger_auto_schema
from .forms import UserRegisterForm, UserLoginForm, ReviewForm
from .models import Review
from .serializers import UserSerializer, ReviewSerializer
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

User = get_user_model()


# Отображение главной страницы с отзывами и формами регистрации, входа и добавления отзыва
def index(request):
    reviews = Review.objects.all()
    register_form = UserRegisterForm()
    login_form = UserLoginForm()
    review_form = ReviewForm()
    return render(request, 'main/index.html', {
        'reviews': reviews,
        'register_form': register_form,
        'login_form': login_form,
        'review_form': review_form
    })


# Обработка регистрации пользователя
def register_view(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('index')
    else:
        form = UserRegisterForm()
    return render(request, 'main/index.html', {'register_form': form})


# Обработка входа пользователя
def login_view(request):
    if request.method == 'POST':
        form = UserLoginForm(request, data=request.POST)
        if form.is_valid():
            email = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=email, password=password)
            if user is not None:
                login(request, user)
                return redirect('index')
    else:
        form = UserLoginForm()
    return render(request, 'main/index.html', {'login_form': form})


# Обработка добавления отзыва, доступна только авторизованным пользователям
@login_required
def add_review(request):
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.user = request.user
            review.save()
            return redirect('index')
    else:
        form = ReviewForm()
    return render(request, 'main/index.html', {'review_form': form})


# API для регистрации пользователя
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer


# API для входа пользователя
class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    class LoginSerializer(serializers.Serializer):
        email = serializers.EmailField()
        password = serializers.CharField(write_only=True)

    @swagger_auto_schema(request_body=LoginSerializer)
    def post(self, request, *args, **kwargs):
        serializer = self.LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user = User.objects.filter(email=email).first()

        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Invalid Credentials'}, status=400)


# API для просмотра и добавления отзывов
class ReviewListCreateView(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# API для лайков отзывов
@api_view(['POST'])
def like_review(request, review_id):
    try:
        review = Review.objects.get(id=review_id)
    except Review.DoesNotExist:
        return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)

    review.likes += 1
    review.save()
    return Response({'likes': review.likes}, status=status.HTTP_200_OK)


# API для получения информации о текущем пользователе
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
