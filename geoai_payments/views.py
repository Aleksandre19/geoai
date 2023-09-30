from django.shortcuts import render
from django.conf import settings
from geoai_payments.forms import PaymentForm

# Create your views here.
def checkout(request):
    payment_form = PaymentForm(label_suffix='')
    context = {
        'welcome': 'GeoAI - ის ჟეტონების შეძენის გვერდი.',
        'stripe_public_key': settings.STRIPE_PUBLIC_KEY,
        'stripe_client_secret_key': 'stripe client secret key',
        'payment_form': payment_form
    }
    return render(request, 'stripe/checkout.html', context)
