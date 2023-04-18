from django.shortcuts import render
from allauth.account.views import LoginView
# Create your views here.

class CustomLoginView(LoginView):
    template_name = 'account/login.html'
    
# def home(request):
#     return render(request, 'home/index.html')
