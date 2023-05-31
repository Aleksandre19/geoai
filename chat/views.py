import logging

from django.shortcuts import render, get_object_or_404, redirect
from django.http import Http404
from django.contrib.auth.decorators import login_required
from chat.models import Topic, Answer, Question
from chat.forms import QuestionForm
from django.core.cache import cache
from django.utils.text import slugify
from geoai_openai.views import get_openai_response
from geoai_translator.views import translate_text

from openaiapi.client import openai_response  

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
        }
        return render(request, 'chat/index.html', context)
    
    # ATTANTION - needs to be complited
    return render(request, 'chat/index.html')



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
        questionText,
        translatedQ,
        answerText,
        translatedA
    ):
    add_topic = topic
    # If the question is new then creating the topic for it. 
    if not topic:
        topic_title = questionText[:20]
        slug = slug
        add_topic = Topic(user=user, title=topic_title, slug=slug)
        add_topic.save()
        # Add new topic in the cache.
        add_to_cache(add_topic)

    add_answer = Answer(
        user=user,
        content=answerText,
        translated=translatedA
    )
    add_answer.save()

    add_question = Question(
        user=user,
        answer=add_answer,
        content_object=add_topic,
        content=questionText,
        translated=translatedQ
    )
    add_question.save()


def add_to_cache(topic):
    topic_cache_key = f"topic_{topic.pk}"
    sentinel = object()
    get_cached_topics = cache.get("topics_by_user", sentinel, 1)
    # Initiate a new diictionary if the cache is empty.
    if get_cached_topics is sentinel:
        get_cached_topics = {}
    get_cached_topics[topic_cache_key] = topic
    cache.set("topics_by_user", get_cached_topics, 1)


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


def call_apis(user, message, slug):
    # Translate from GEO to ENG.
    question_geo_to_eng = translate_text(message, 'ka', 'en-US')
    if not question_geo_to_eng:
            logger.error("Couldn't translate from Geo to Eng.")
            return

    # Call a Openai API.
    response = openai_response(question_geo_to_eng, slug)
    if not response:
        logger.error("Couldn't get the response from the OpenAI.")
        return 

    # Translate from ENG to GEO.
    response_eng_to_geo = translate_text(response, 'en-US', 'ka')
    if not response_eng_to_geo:
        logger.error("Couldn't translate from Eng to Geo.")
        return

    # if not slug:
    #     slug = slugify(question_geo_to_eng[:20])
    topic = get_topic(slug)
    insert_content(
        topic, user, slug, message,
        question_geo_to_eng,
        response_eng_to_geo,
        response
    )

    return {
        # 'question': {
        #     'geo': message,
        #     'eng': question_geo_to_eng,
        # },
        'response': {
            'geo': response_eng_to_geo,
            'eng': response,
            'slug': slug,
        }
    }


# Map the Georgian Alphabet to English.
georgianToEng = {
    'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v',
    'ზ': 'z', 'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm',
    'ნ': 'n', 'ო': 'o', 'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's',
    'უ': 'u', 'ფ': 'f', 'ქ': 'q', 'ღ': 'gh', 'ყ': 'k', 'შ': 'sh',
    'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz', 'წ': 'ts', 'ჭ': 'ch', 'ხ': 'kh',
    'ჯ': 'j', 'ჰ': 'h', ' ': ' '
}

# Convert Georgian letter to English.
def convertToEng(text):
    result = ''
    for char in text.lower():
        if char in georgianToEng:
            result += georgianToEng[char]
    return result
