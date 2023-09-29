from django.shortcuts import render

# Create your views here.
def checkout(request):
    context = {'welcome': 'Welcome to the GeoAI payments page!'}
    return render(request, 'stripe/checkout.html', context)
