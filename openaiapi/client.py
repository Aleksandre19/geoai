import requests
import json
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.http import Http404
from chat.models import Topic


OPENAI_API_KEY = settings.OPENAI_API_KEY
OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {OPENAI_API_KEY}',
}


def system_prompt():
    return [{'role': 'system', 'content': 'You are a helpful assistant.'}]


def current_question(question):
    return {'role': 'user', 'content': question}


def topic_previous_messages(topic_messages, slug=None):
    try:
        topic = get_object_or_404(Topic, slug=slug)
    except Http404:
        return topic_messages
   
    questions = topic.question.all()
    for question in questions:
        user_question = {'role': 'user', 'content': question.translated}
        topic_messages.append(user_question)
        ai_answer = {'role': 'assistant', 'content': question.answer.eng_content}
        topic_messages.append(ai_answer)
    return topic_messages


def messages(question, slug):
    topic_messages = system_prompt()   
    topic_messages = topic_previous_messages(topic_messages, slug)
    topic_messages.append(current_question(question))
    return topic_messages  


def set_up_data(messages):
    data = {
        'model': 'gpt-3.5-turbo',
        'messages': messages,
    }
    return data


def openai_response(question, slug=None):
    data = set_up_data(messages(question, slug))
    response = requests.post(OPENAI_API_URL, headers=headers, data=json.dumps(data))
    response.raise_for_status()
    return response.json()['choices'][0]['message']['content']