from django import forms
from chat.models import Question

class QuestionForm(forms.ModelForm):
    class Meta:
        model = Question
        fields = ["content"]

    def __init__(self, *args, **kwargs):
        super(QuestionForm, self).__init__(*args, **kwargs)
        self.fields['content'].widget.attrs.update({'id': 'chat-message-input'})
