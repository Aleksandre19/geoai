from django import forms
from chat.models import Question

class QuestionForm(forms.ModelForm):
    class Meta:
        model = Question
        fields = ["content"]
