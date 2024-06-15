from django.shortcuts import render


def index(request):
    return render(request, 'main/index.html')


def login_view(request):
    return render(request, 'main/login.html')


def register_view(request):
    return render(request, 'main/register.html')
