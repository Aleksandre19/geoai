from django.shortcuts import render
from django.conf import settings
# from django.http import JsonResponse
# import requests
import openai

openai.api_key = settings.OPENAI_API_KEY


def get_openai_response(content):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=content,
        temperature=0.3,
    )

    return response.choices[0].text


# # Example 
# def openai_request(request):
#     api_key = settings.OPENAI_API_KEY
#     url = 'https://api.openai.com/v1/edits'
#     headers = {
#         'Content-Type': 'application/json',
#         'Authorization': f'Bearer {api_key}'
#     }
#     data = {
#         'model': 'text-davinci-edit-001',
#         'input': 'What day of the wek is it?',
#         'instruction': 'Fix the spelling mistakes'
#     }
#     response = requests.post(url, headers=headers, json=data)
#     return JsonResponse(response.json())

# def generate_prompt(content):
#      return """You are the the AI assistant and aswer on the users questions."""