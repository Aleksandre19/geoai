from django.shortcuts import render
from django.conf import settings
import openai

openai.api_key = settings.OPENAI_API_KEY

# Create your views here.

def get_openai_response(content):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=content,
        temperature=0.3,
    )

    return response.choices[0].text


# def generate_prompt(content):
#      return """You are the the AI assistant and aswer on the users questions."""