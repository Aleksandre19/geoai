"""
This middleware manages JWT tokens when the user want to perform
an asynchronous request from the client-side, such as deletin a topic or editing it's title.

It checks if the user is authenticated and verifies the presence
of tokens (acccess & refresh) in the HTTP-only cookies.
If these tokens exist, it then checks if the access token has expired.
If it hasn't, the middleware sets the access token in the request header.
If the access token has expired, the middleware attempts to refresh it 
with the refresh token. If the refresh token is not expired, the middleware
obtains a new access token and sets it in the request header. 
If the refresh token is expired, the middleware notifies the user to log out and log in again.

If there are no tokens in the cookies, the middleware generates new ones,
stores them int the HTTP-only cookies, and sets the access token in the request header.

"""
from datetime import timedelta

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

import jwt
from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth.models import AnonymousUser


class JwtMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        access = request.COOKIES.get('access')
        refresh = request.COOKIES.get('refresh')
        user = getattr(request, 'user', None)

        if user and not isinstance(user, AnonymousUser):
            if access and refresh:
                try:
                    #print('Decode')
                    # Decode the access token. This will raise an error if it's expired
                    jwt.decode(access, settings.SECRET_KEY, algorithms=['HS256'])
                    request.META['HTTP_AUTHORIZATION']  = 'Bearer ' + str(access)
                except jwt.ExpiredSignatureError:
                    try:
                         # The access token is expired, so we try to refresh it
                         RefreshToken(refresh).check_blacklist()
                         new_token = RefreshToken(refresh).access_token
                         #print('New Token')

                         # Set new access token to HttpOnly Cookie
                         response = self.get_response(request)
                         response.set_cookie('access', str(new_token), httponly=True, max_age=3600)
                         request.META['HTTP_AUTHORIZATION'] = 'Bearer ' + str(new_token)
                         return response
                    except TokenError:
                         #print('Needs  to be log out')
                         # The refresh token is expired, return an error message
                         return JsonResponse({'error': 'Please log out and log in again'}, status=401)
            else:
                # No tokens in the cookies, generate new ones
                #print('No tokens in cookies generate new ones')
                refresh = RefreshToken.for_user(user)
                access = refresh.access_token

                # Set the tokens to HttpOnly cookies
                response = self.get_response(request)
                response.set_cookie('access', str(access), httponly=True, max_age=3600)
                response.set_cookie('refresh', str(refresh), httponly=True, max_age=86400 * 7)
                request.META['HTTP_AUTHORIZATION'] = 'Bearer ' + str(access)
                return response
        return self.get_response(request)

