from django.http import HttpResponse

class StripeWebhook:
    """ Handle Stripe webhook."""
    
    def __init(self, request):
        self.request = request

    def handle_webhook(self, event):
        """
        Handle a generic/unknown/unexpected webhook event.
        """
        return HttpResponse(
            content=f'Webhook recieved: {event["type"]}',
            status=200
        )

    def handle_payment_intent_succeed(self, event):
        """
        Handle payment_intent.succeed webhook from stripe.
        """
        return HttpResponse(
            content=f'Webhook recieved: {event["type"]}',
            status=200
        )
    

    def handle_payment_intent_payment_failed(self, event):
        """
        Handle payment_intent.payment_failed webhook from stripe.
        """
        return HttpResponse(
            content=f'Webhook recieved: {event["type"]}',
            status=200
        )

    