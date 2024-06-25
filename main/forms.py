from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import User, Review

class UserRegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)
    name = forms.CharField(max_length=100, required=True)

    class Meta:
        model = User
        fields = ['name', 'email', 'password1', 'password2']

class UserLoginForm(AuthenticationForm):
    username = forms.EmailField(label='Email')

class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['content']
