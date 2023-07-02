import logging

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



logger = logging.getLogger(__name__)

# Notes
#1 Complite caching the questions and answers.
    # subject caching is implemented.
#2 Write a conditions for the else:
#3 Use DjDT debug to optimaze performance of the webpage

# Create your views here.

@login_required
def chat(request, slug=None):
    if request.user.is_active:
        questions = None
        topic = None
        if slug:
            topic = get_object_or_404(Topic, slug=slug)
            questions = topic.question.all()

        # Testing formatting
        # test_question = Question.objects.all().order_by('-id')[1]
        # test_question = Question.objects.last()
        # ex = exclude_code(test_question.answer.eng_content)
        # print(ex)
        #inc = include_back_code(ex)
        # print(inc, 'included')

        # It seems here is the problem when posting the new question and redirecting
        # to the index page. it display only the current question's topic. 

        topics = get_all_topics_by_user(request)
        question_form = QuestionForm()

        if request.method == 'POST':
            question = post_question(request, topic)
            if question: 
                return redirect('topic', slug=question.get('slug'))  

        context = {
            # Used for caching
            'topics': list(topics.values()),
            'questions': questions,
            'slug': slug,
            # 'topics': topics,
            'question_form': question_form,
            #'test': inc,
        }
        return render(request, 'chat/index.html', context)
    
    # ATTANTION - needs to be complited
    return render(request, 'chat/index.html')


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
            convert_alphabet = convertToEng(question_content[:20])
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
        topic,
        user,
        slug,
        geo_question,
        eng_question,
        formated_geo_response,
        unformated_geo_response,
        unformated_eng_response 
        # questionText,
        # translatedQ,
        # geo_unformated_answer,
        # eng_answer
    ):
    add_topic = topic
    # If the question is new then creating the topic for it. 
    if not topic:
        topic_title = geo_question[:20]
        slug = slug
        add_topic = Topic(user=user, title=topic_title, slug=slug)
        add_topic.save()
        # Add new topic in the cache.
        add_to_cache(add_topic)

    # geo_formated_answer = text_format(geo_unformated_answer)

    add_answer = Answer(
        user=user,
        geo_formated_content=formated_geo_response,
        geo_unformated_content=unformated_geo_response,
        eng_content=unformated_eng_response
    )
    add_answer.save()

    add_question = Question(
        user=user,
        answer=add_answer,
        content_object=add_topic,
        content=geo_question,
        translated=eng_question
    )
    add_question.save()



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
    
    response_exclude_snippet = exclude_code(unformated_eng_response)

    # Translate from ENG to GEO.
    geo_response_without_snippet = translate_text(response_exclude_snippet, 'en-US', 'ka')
    if not geo_response_without_snippet:
        logger.error("Couldn't translate from Eng to Geo.")
        return
    
    response_return_snippet = include_back_code(geo_response_without_snippet)
    unformated_geo_response = response_return_snippet

    formated_geo_response = response_return_snippet
    # formated_geo_response = text_format(response_return_snippet)
    # Reassembly the translated text and the extracted content.

    # if not slug:
    #     slug = slugify(question_geo_to_eng[:20])
    topic = get_topic(slug)
    insert_content(
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
        }
    }

