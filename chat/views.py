import logging
from typing import Any, Dict
from django.db.models.query import QuerySet

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required

from chat.models import Topic, Answer, Question
from chat.forms import QuestionForm

from django.utils.text import slugify
from geoai_translator.views import translate_text

# from geoai_openai.views import get_openai_response

# from django.utils.safestring import mark_safe

from openaiapi.client import openai_response  

from .helpers import *


from django.views.generic import ListView
from django.contrib.auth.mixins import LoginRequiredMixin

logger = logging.getLogger(__name__)

# Notes
#1 Complite caching the questions and answers.
    # subject caching is implemented.
#2 Write a conditions for the else:
#3 Use DjDT debug to optimaze performance of the webpage

class ChatView(LoginRequiredMixin, ListView):

    # Define the model and template to be used.
    template_name = 'chat/index.html'
    model = Topic

    def get_queryset(self):
        """
        Returns the QuerySet that will be used to retrieve the objects.
        """
        slug = self.kwargs.get('slug')
        if slug:
            # Filter the QuerySet based on user and slug if slug exists.
            return Topic.objects.filter(user = self.request.user, slug=slug)
        else:
            # If no slug, return all Topics of the user
            return Topic.objects.filter(user = self.request.user)
        
    
    def get_context_data(self, **kwargs: Any):
        """
        Returns the context data to be used in the template.
        """
        context = super().get_context_data(**kwargs)
        
        titles = Topic.objects.filter(user=self.request.user)
        slug = self.kwargs.get('slug')
        questions = None
        
        if slug:
            # If slug exists, get the Topic object and its related Questions.
            topic = get_object_or_404(Topic, slug=slug)
            questions = topic.question.all()

        context.update({
                'topics': titles,
                'questions': questions,
                'question_form': QuestionForm(),
                'user_id': self.request.user.id,
                'slug': slug
        })
        return context
    

    def post(self, request, *args, **kwargs):
        """
        Handles the POST requests
        """
        slug = self.kwargs.get('slug')
        topic = get_object_or_404(Topic, slug=slug) if slug else None
        
        # Call the function to handle posting a question
        post_question(request, topic)

        # Redirect based on whether slug exists or not.
        if slug:
            return redirect('topic', slug=slug)
        else:
            return redirect('chat_home')



def get_all_topics_by_user(request):
    user_topics = Topic.objects.filter(user=request.user)
    topics_by_user = {f"topic_{topic.pk}": topic for topic in user_topics}
    return topics_by_user


def get_topic(slug):
    try:
        topic = get_object_or_404(Topic, slug=slug)
    except Http404:
        topic = None
    return topic


def websocket_chat(user, message, slug):
    if user.is_authenticated:
        result = call_apis(user, message, slug)
        return result


@login_required
def post_question(request, topic=None):
    question_form = QuestionForm(request.POST)  
    if question_form.is_valid():    
        # add_topic = topic
        # Grab content from the form element.
        question_content =  question_form.cleaned_data['content']
        if topic:
            slug = topic.slug

        if not topic:
            convert_alphabet = convertToEng(question_content[:15])
            slug = slugify(convert_alphabet)
            
        # Call OpenAi API & Google Translate API.
        call_apis(request.user, question_content, slug)
    
        return {
            "slug": slug
        }
    else:
        # ATTANTION - Needs to be edited
        return False


def insert_content(
        topic,user,slug,geo_question,
        eng_question,formated_geo_response,
        unformated_geo_response, unformated_eng_response 
        # questionText,
        # translatedQ,
        # geo_unformated_answer,
        # eng_answer
    ):
    # geo_formated_answer = text_format(geo_unformated_answer)
    if not topic:
        topic_title = geo_question[:15]
        slug = slug
        topic = Topic(user=user,
                title=topic_title,slug=slug)
        
        topic.save()

    add_question = Question(
            user=user,topic=topic,content=geo_question,
            translated=eng_question
        )
    
    add_question.save()

    add_answer = Answer(
        user=user, question=add_question,
        geo_formated_content=formated_geo_response,
        geo_unformated_content=unformated_geo_response,
        eng_content=unformated_eng_response
    )
    add_answer.save()

    # Add new topic in the cache.
    add_to_cache(topic)

    return {
        'topic_id': topic.id,
    }



def call_apis(user, geo_question, slug):
    # Translate from GEO to ENG.
    eng_question = translate_text(geo_question, 'ka', 'en-US')
    if not eng_question:
            logger.error("Couldn't translate from Geo to Eng.")
            return

    # Call a Openai API.
    unformated_eng_response = openai_response(eng_question, slug)
    if not unformated_eng_response:
        logger.error("Couldn't get the response from the OpenAI.")
        return
    
    response_exclude_snippet = exclude_code(unformated_eng_response)['text']

    # Translate from ENG to GEO.
    geo_response_without_snippet = translate_text(
        response_exclude_snippet,
        'en-US', 'ka')
    
    if not geo_response_without_snippet:
        logger.error("Couldn't translate from Eng to Geo.")
        return
    
    response_return_snippet = include_back_code(geo_response_without_snippet)
    unformated_geo_response = response_return_snippet

    formated_geo_response = response_return_snippet
    # formated_geo_response = text_format(response_return_snippet)
    # Reassembly the translated text and the extracted content.

    if not slug:
        slug = slugify(eng_question[:20])
        
    topic = get_topic(slug)
    result = insert_content(
        topic, user, slug, 
        geo_question,
        eng_question,
        formated_geo_response,
        unformated_geo_response,
        unformated_eng_response
    )

    return {
        # 'question': {
        #     'geo': message,
        #     'eng': question_geo_to_eng,
        # },
        'response': {
            'geo': formated_geo_response,
            'eng': unformated_eng_response,
            'slug': slug,
            'topic_id': result['topic_id'],
        }
    }

