from django.shortcuts import render
from allauth.account.views import LoginView
# Create your views here.

class CustomLoginView(LoginView):
    template_name = 'account/login.html'

    def get_context_data(self, **kwargs):
        context =  super().get_context_data(**kwargs)

        # Grab user language from the cookies.
        lang = self.request.COOKIES.get('django_language', None)

        # Map language code to the it's name.
        languages = {
            'ka': 'Georgian',
            'en': 'English',
        }
        
        context.update({
            'language': languages.get(lang, 'English'),
        })

        return context
    
# def home(request):
#     return render(request, 'home/index.html')
