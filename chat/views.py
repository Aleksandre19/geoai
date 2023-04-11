from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from chat.models import Topic, Answer
from chat.forms import QuestionForm

# Create your views here.
# @login_required
def chat(request):
    if request.user.is_active:
        topics = Topic.objects.filter(user=request.user)
        question_form = QuestionForm()

        if request.method == 'POST':
            question = post_question(request)
            return redirect('topic', slug=question.get('slug'))  

        context = {
            "topics": topics,
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


