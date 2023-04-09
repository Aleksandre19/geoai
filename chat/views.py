from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from chat.models import Subject, Question

# Create your views here.
def chat(request):
    if request.user.is_active:
        subjects = Subject.objects.filter(user=request.user)
    
        context = {
            "subjects": subjects
        }
        return render(request, 'chat/index.html', context)

    return render(request, 'chat/index.html')


def single_subject(request, slug):

    if request.user.is_active:
        subject = get_object_or_404(Subject, slug=slug)
        questions = subject.question.all()

        context = {
            "questions": questions,
        }

        return render(request, 'chat/single_subject.html', context)

    return render(request, 'chat/single_subject.html', {"context": ""})
