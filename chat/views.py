from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from chat.models import Topic, Answer
from chat.forms import QuestionForm
from django.core.cache import cache
from django.utils.text import slugify
from geoai_openai.views import get_openai_response
from geoai_translator.views import translate_text


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
        # Used for caching
        def get_all_topics_by_user():
            user_topics = Topic.objects.filter(user=request.user)
            topics_by_user = {f"topic_{topic.pk}": topic for topic in user_topics}
            return topics_by_user

        # Cache topics
        # Used for cache
        # It seems here is the problem when posting the new question and redirecting
        # to the index page. it display only the current question's topic. 
        # topics = cache.get_or_set('topics_by_user', get_all_topics_by_user, 1)
        topics = get_all_topics_by_user()
        # topics = Topic.objects.filter(user=request.user)
        question_form = QuestionForm()

        if request.method == 'POST':
            question = post_question(request, topic)
            if question:
                return redirect('topic', slug=question.get('slug'))  

        context = {
            # Used for caching
            'topics': list(topics.values()),
            'questions': questions,
            # 'topics': topics,
            'question_form': question_form,
        }
        return render(request, 'chat/index.html', context)
    
    # ATTANTION - needs to be complited
    return render(request, 'chat/index.html')


@login_required
def post_question(request, topic=None):
    question_form = QuestionForm(request.POST)  
    if question_form.is_valid():    
        add_topic = topic
        # Grab content from the form element.
        question_content =  question_form.cleaned_data['content']
        # Translate the content into english.
        question_geo_to_eng = translate_text(question_content, 'ka', 'en-US')
        if question_geo_to_eng:
            # Get response from openai API.
            response = get_openai_response(question_geo_to_eng)
            if response:
                # Translate the response into Georgian.
                response_eng_to_geo = translate_text(response, 'en-US', 'ka')
                if response_eng_to_geo:
                    # If the question is new then creating the topic for it. 
                    if not topic:
                        topic_title = question_content[:20]
                        slug = slugify(question_geo_to_eng[:20])
                        add_topic = Topic(user=request.user, title=topic_title, slug=slug)
                        add_topic.save()

                        # Add new topic in the cache.
                        add_to_cache(add_topic)
                
                    # Add the question to the database.        
                    add_question = question_form.save(commit=False)
                    add_question.content_object = add_topic
                    add_question.translated = question_geo_to_eng
                    add_question.user = request.user
                

                    # Answer
                    answer_text = response_eng_to_geo
                    translated_answer = response
                    answer = Answer(user=request.user, content=answer_text, translated=translated_answer)
                    answer.save()

                    add_question.answer = answer
                    add_question.save()
                
                    return {
                        "slug": add_topic.slug,
                        "question": add_question,
                    }
    else:
        # ATTANTION - Needs to be edited
        return False


def add_to_cache(topic):
    topic_cache_key = f"topic_{topic.pk}"
    sentinel = object()
    get_cached_topics = cache.get("topics_by_user", sentinel, 1)
    # Initiate a new diictionary if the cache is empty.
    if get_cached_topics is sentinel:
        get_cached_topics = {}
    get_cached_topics[topic_cache_key] = topic
    cache.set("topics_by_user", get_cached_topics, 1)

