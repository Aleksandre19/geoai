from django.shortcuts import render, redirect
from django.conf import settings
from django.views.generic import ListView, TemplateView
from django.contrib import messages

from geoai_payments.forms import PaymentForm
from geoai_payments.models import Payments

import stripe


class Amount(TemplateView):
    template_name = 'stripe/choose_amount.html'


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

        # Get amount from get request.
        amount = self.kwargs.get('amount')
        # Convert to Stripe format.
        stripe_amount = int(amount) * 100

        if not settings.STRIPE_PUBLIC_KEY:
            messages.warning(self.request, 'ვერ მოიძებნა Stripe - ის საჯარო გასარები.')

        # Stripe 
        stripe.api_key = settings.STRIPE_SECRET_KEY
        intent = stripe.PaymentIntent.create(
            amount=stripe_amount,
            currency = settings.STRIPE_CURRENCY
        )

        context.update({
            'welcome': 'GeoAI - ის ჟეტონების შეძენის გვერდი.',
            'stripe_public_key': settings.STRIPE_PUBLIC_KEY,
            'stripe_client_secret_key': intent.client_secret,
            'payment_form': payment_form,
            'amount': amount
        })

        return context
    

    def post(self, request, *args, **kwargs):
        amount = self.kwargs.get('amount')
        return redirect('checkout', amount=amount)