from django.http import HttpResponse
from geoai_payments.models import Payments

class StripeWebhook:
    """ Handle Stripe webhook."""
    
    def __init__(self, request):
        self.request = request
        self.payment_exists = False

    def handle_event(self, event):
        """
        Handle a generic/unknown/unexpected webhook event.
        """
        return HttpResponse(
            content=f'Unhandled Webhook recieved: {event["type"]}',
            status=200
        )

    def handle_payment_intent_succeeded(self, event):
        """
        Handle payment_intent.succeeded webhook from stripe.
        """
        # Get payment intent from the Stripe.
        intent = event.data.object    

        try:
            """
            After payment on payment_intent.succeeded webhook, check
            if the payment existst in the datapage and if not create it.
            """
            # Grab the payment object.
            Payments.objects.get(
                user = self.request.user,
                email__iexact = intent.metadata.username,
            )

            # Payment exists.
            self.payment_exists = True

            # Retutn success response  to the Stripe.
            return HttpResponse(
                content=f'Webhook recieved: {event["type"]}',
                status=200
            )
        
        # If payment doesn't exists, create it.
        except Payments.DoesNotExist:
            try:
                """ 
                Try create the payment and if there is some problem,
                delete the current payment and return HTTP resposnse to Stripe
                With Status 500 which will mean that Stripe will try again the Webhook later.
                """

                # Create the payment.
                payment = Payments.objects.create(
                    user = self.request.user,
                    email__iexact = intent.metadata.username,
                )
                payment.save()

            except Exception as e:
                # Delete the payment.
                if payment:
                    payment.delete()

                # Return response to Stripe.
                return HttpResponse(
                        content=f'Webhook recieved: {event["type"]} | ERROR {e}',
                        status=500
                    )

        return HttpResponse(
                content=f'Webhook recieved: {event["type"]}',
                status=200
            )
    

    def handle_payment_intent_payment_failed(self, event):
        """
        Handle payment_intent.payment_failed webhook from stripe.
        """
        return HttpResponse(
            content=f'Falied payment Webhook recieved: {event["type"]}',
            status=200
        )

    