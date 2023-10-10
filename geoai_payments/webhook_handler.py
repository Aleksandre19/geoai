from django.http import HttpResponse
from django.contrib import messages
from django.conf import settings

from geoai_payments.models import Payments
from user_setting.models import UserTokens
from geoai_auth.models import User

import time

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
        user_id = intent.metadata.user_id
        user = self.get_user(user_id, event)
        self.check_if_payment_exsists(intent, user, event)

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
    

    def get_user(self, user_id, event):
        """ 
        Get the user ID from Stripe metadata and  grabs the user by it.
        """
        try:
            user = User.objects.get(id=user_id)
            return user
        except User.DoesNotExist:
            messages.error("User wasn't found. Please try later.")
            return HttpResponse(
                content=f"User wasn't found: {event['type']}",
                status=500
            )

    def check_if_payment_exsists(self, intent, user, event):
        # Check if the payment exsists in database.
        attempt = 1
        """ 
        Attempt five times to with one sec intervals to check if 
        payment exists when first attempt returns false
        """
        while attempt <= 5:
            try:
                """
                After payment on payment_intent.succeeded webhook, check
                if the payment existst in the database and if not create it.
                """
                # Grab the payment object.
                Payments.objects.get(
                    user = user,
                    payment_id__iexact = intent.metadata.payment_id,
                    amount__iexact = intent.metadata.amount
                )

                # Payment exists.
                self.payment_exists = True
                break
            
            # If payment doesn't exists increment the attempt 
            # by one and sleep by one sec.
            except Payments.DoesNotExist:
                attempt += 1
                time.sleep(1)

        # Return success response to Stripe when payment exsists.
        if self.payment_exists:
            # Retutn success response  to the Stripe.
            return HttpResponse(
                content=f'Webhook recieved: {event["type"]}',
                status=200
            )
        else:  # Create the payment when doesn't exsist in database.
            payment = None
            try:
                """ 
                Try create the payment and if there is some problem,
                delete the current payment and return HTTP resposnse to Stripe
                With Status 500 which will mean that Stripe will try again the Webhook later.
                """
                # Create the payment.
                payment = Payments.objects.create(
                    user = user,
                    payment_id = intent.metadata.payment_id,
                    amount = intent.metadata.amount,
                )

                payment.save()

                 # Update tokens.
                self.update_tokens(user, payment.amount, payment.payment_id)

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
                content=f'Webhook recieved: {event["type"]} | SUCCESS: Payment in Webhook.',
                status=200
            )
    

    def update_tokens(self, user, amount, payment_id):
        try:
            UserTokens.objects.get(
                    user=user,
                    value=amount,
                    token_id=payment_id
                )
        except UserTokens.DoesNotExist:
            token_price = settings.TOKEN_PRICE # Price per token.
            current_tokens = int(amount) / token_price 

            # Grab the user tokens.
            user_tokens = UserTokens.objects.get(user=user)

            # Clean old token and leave only unused tokens.
            clean_token_value = user_tokens.value - user_tokens.used
            # Unused tokens plus the purchased tokens.
            new_token_value = clean_token_value + current_tokens
            
            user_tokens.value = new_token_value # Set tokens.
            user_tokens.used = 0 # Reset the used tokens.
            user_tokens.token_id = payment_id
            user_tokens.save()

    