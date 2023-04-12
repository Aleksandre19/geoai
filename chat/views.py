from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from chat.models import Topic, Answer
from chat.forms import QuestionForm
from django.core.cache import cache

# Notes
#1 Complite caching the questions and answers.
    # subject caching is implemented.
#2 Write a consitions for the else:

# Create your views here.
# @login_required
def chat(request):
    if request.user.is_active:

        def get_all_topics_by_user():
            user_topics = Topic.objects.filter(user=request.user)
            topics_by_user = {f"topic_{topic.pk}": topic for topic in user_topics}
            return topics_by_user

        # Cache topics
        topics = cache.get_or_set('topics_by_user', get_all_topics_by_user, 60)
        question_form = QuestionForm()

        if request.method == 'POST':
            question = post_question(request)
            return redirect('topic', slug=question.get('slug'))  

        context = {
            "topics": list(topics.values()),
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
        # If the question is new then 
        # creating the topic for it. 
        if not topic:
            topic_title = question_form.cleaned_data['content'][:20]
            add_topic = Topic(user=request.user, title=topic_title, slug=topic_title)
            add_topic.save()
            # Add new topic in the cache.
            add_to_cache(add_topic)
       
        # Add the question to the database.        
        add_question = question_form.save(commit=False)
        add_question.content_object = add_topic
        add_question.user = request.user
        add_question.save()

        # Fake answer on the question
        answer_text = """
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu.
        """
        answer = Answer(user=request.user, content=answer_text, question=add_question)
        answer.save()
    
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
    get_cached_topics = cache.get("topics_by_user", sentinel)
    # Initiate a new diictionary if the cache is empty.
    if get_cached_topics is sentinel:
        get_cached_topics = {}
    get_cached_topics[topic_cache_key] = topic
    cache.set("topics_by_user", get_cached_topics)


@login_required
def topic(request, slug=""):

    if request.user.is_active:
        topic = get_object_or_404(Topic, slug=slug)
        questions = topic.question.all()

        # Ask question
        if request.method == 'POST':
            question = post_question(request, topic)
            # return redirect(request.path_info)
            return redirect('topic', slug=question.get('slug'))
        else:
            question_form = QuestionForm()

        context = {
            "questions": questions,
            "question_form": question_form,
        }

        return render(request, 'chat/topic.html', context)
   
    # else:
    #     question_form = None

    #     context = {
    #         "question_form": question_form,
    #     }

    #     return render(request, 'chat/topic.html', context)

