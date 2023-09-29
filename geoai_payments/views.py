from django.shortcuts import render
from django.conf import settings

# Create your views here.
def checkout(request):
    context = {
        'welcome': 'Welcome to GeoAI payments page!',
        'stripe_public_key': settings.STRIPE_PUBLIC_KEY,
        'stripe_client_secret_key': 'stripe client secret key'
    }
    return render(request, 'stripe/checkout.html', context)
