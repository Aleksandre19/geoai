from django.http import HttpResponse

class StripeWebhook:
    """ Handle Stripe webhook."""
    
    def __init__(self, request):
        self.request = request

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
        Handle payment_intent.succeed webhook from stripe.
        """
        intent = event.data.object
        print('======== INTENT ========', intent)
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

    