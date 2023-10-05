from django.conf import settings
from django.http import HttpResponse
from django.utils.decorators import method_decorator

from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.views import View

from geoai_payments.webhook_handler import StripeWebhook

import stripe


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(require_POST, name='dispatch')
class Webhook(View):
    def setup(self, request, *args, **kwargs):
        # Call parent setup method.
        super().setup(request, *args, **kwargs)

        # Setup the Stripe Webhook.
        self.wh_secret = settings.STRIPE_WH_SECRET
        stripe.api_key = settings.STRIPE_SECRET_KEY

        # Get the webhook data and verify its signature
        self.payload = request.body
        self.sig_header = request.META['HTTP_STRIPE_SIGNATURE']
        self.event = None

    def post(self, request, *args, **kwargs):
        try:
            self.event = stripe.Webhook.construct_event(
                self.payload, self.sig_header, self.wh_secret
            )
        except ValueError as e:
            # Invalid payload
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            return HttpResponse(status=400)
        except Exception as e:
            return HttpResponse(content=e, status=400)
        
        # Manage Stripe event.
        return self.process_event(request, *args, **kwargs)
      
    def process_event(self, request, *args, **kwargs):
        # Set up webhook handler.
        handler = StripeWebhook(self.request)

        # Map the webhook events to relavant handler functions.
        event_map = {
            'payment_intent.succeeded': handler.handle_payment_intent_succeeded,
            'payment_inten.payment_failed': handler.handle_payment_intent_payment_failed
        }

        # Get the webhook type from the stripe.
        event_type = self.event['type']

        # If there's a handler for it, get it from the event map.
        # Use generic one by default.
        event_handler = event_map.get(event_type, handler.handle_event)

        # Call the event handler with the event.
        response = event_handler(self.event)
        return response


# @require_POST
# @csrf_exempt
# def webhook(request):
#     """ Listen for webhooks from Stripe. """
#     # Setup
#     wh_secret = settings.STRIPE_WH_SECRET
#     stripe.api_key = settings.STRIPE_SECRET_KEY

#     # Get the webhook data and verify its signature
#     payload = request.body
#     sig_header = request.META['HTTP_STRIPE_SIGNATURE']
#     event = None

#     try:
#         event = stripe.Webhook.construct_event(
#             payload, sig_header, wh_secret
#         )
#     except ValueError as e:
#         # Invalid payload
#         return HttpResponse(status=400)
#     except stripe.error.SignatureVerificationError as e:
#         # Invalid signature
#         return HttpResponse(status=400)
#     except Exception as e:
#         return HttpResponse(content=e, status=400)
    
#     print('======== WEBHOOK SUCCESS =============')
#     return HttpResponse(status=200)