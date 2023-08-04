from typing import Any, Dict
from django import forms
from chat.models import Question
from chat.helpers import convertToEng
from django.utils.text import slugify


class QuestionForm(forms.ModelForm):
    class Meta:
        model = Question
        fields = ["content"]

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        self.topic = kwargs.pop('topic', None)
        super(QuestionForm, self).__init__(*args, **kwargs)
        self.fields['content'].widget.attrs.update({'id': 'chat-message-input'})


    def clean(self):
        """
        Validates the form.
        """
        cleaned_data = super().clean()
        question_content = cleaned_data.get('content')

        slug = self.generate_slug(question_content)

        # Here i cannot call the call_apis() function from the views.py
        # because it will cause a circular import.
        # I have to find other way to call the call_apis() function.

    
    def generate_slug(self, question_content):
        """
        Generates a slug from the question content.
        """
        if self.topic:
            slug = self.topic.slug

        convert_alphabet = convertToEng(question_content[:15])
        return slugify(convert_alphabet)    
    
        
