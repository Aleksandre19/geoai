from django.shortcuts import render, redirect
from django.conf import settings
from django.views.generic import ListView
from django.contrib import messages

from geoai_payments.forms import PaymentForm
from geoai_payments.models import Payments

import stripe

# Create your views here.
class Checkout(ListView):
    template_name = 'stripe/checkout.html'
    model = Payments 

    def get_context_data(self, **kwargs):
        """
        Overwrite the default context.
        """

        # Grab main context.
        context = super().get_context_data(**kwargs)

        # Payment form.
        payment_form = PaymentForm()

        if not settings.STRIPE_PUBLIC_KEY:
            messages.warning(self.request, 'ვერ მოიძებნა Stripe - ის საჯარო გასარები.')

        # Stripe 
        stripe.api_key = settings.STRIPE_SECRET_KEY
        intent = stripe.PaymentIntent.create(
            amount=100,
            currency = settings.STRIPE_CURRENCY
        )

        context.update({
            'welcome': 'GeoAI - ის ჟეტონების შეძენის გვერდი.',
            'stripe_public_key': settings.STRIPE_PUBLIC_KEY,
            'stripe_client_secret_key': intent.client_secret,
            'payment_form': payment_form
        })

        return context
    

    def post(self, request, *args, **kwargs):
        return redirect('checkout')