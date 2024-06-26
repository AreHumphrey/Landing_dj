from django.urls import path
from . import views
from .views import RegisterView, LoginView, ReviewListCreateView

urlpatterns = [
    path('', views.index, name='index'),
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('add_review/', views.add_review, name='add_review'),
    # API paths
    path('api/register/', RegisterView.as_view(), name='api_register'),
    path('api/login/', LoginView.as_view(), name='api_login'),
    path('api/reviews/', ReviewListCreateView.as_view(), name='api_reviews'),
    path('api/review/<int:review_id>/like/', views.like_review, name='like_review'),
]
