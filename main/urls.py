from django.urls import path
from . import views
from .views import RegisterView, LoginView, ReviewListCreateView, like_review, current_user

urlpatterns = [
    path('', views.index, name='index'),
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('add_review/', views.add_review, name='add_review'),
    # API paths
    path('api/register/', RegisterView.as_view(), name='api_register'),
    path('api/login/', LoginView.as_view(), name='api_login'),
    path('api/review/', ReviewListCreateView.as_view(), name='api_reviews'),
    path('api/review/<int:review_id>/like/', like_review, name='like_review'),
    path('api/user/', current_user, name='current_user'),
]
