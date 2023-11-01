from django import forms
from geoai_openai.models import Parameters

class ParameterForm(forms.ModelForm):
    """ OpenAI API parameters form. """
    
    class Meta:
        model = Parameters
        fields = ['model', 'instruction', 'temperature', 'top_p']