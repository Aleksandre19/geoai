from django import forms
from geoai_openai.models import Parameters

class ParameterFors(forms.ModelForm):
    model = Parameters
    fields = ['model', 'instruction', 'temperature', 'top_p', 'max_tokens']