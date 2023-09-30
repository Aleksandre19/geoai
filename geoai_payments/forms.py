from django import forms
from geoai_payments.models import Payments

class PaymentForm(forms.ModelForm):
    class Meta:
        model = Payments
        fields = ('amount',)
        # Make range slider.
        widgets = {
            'amount': forms.NumberInput(
                    attrs={
                        'type': 'range', 
                        'min': 10, 
                        'max': 100, 
                        'step': 10,
                    }
                ),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Set default value to the range.
        self.fields['amount'].initial = 20
  
        # Assign labels.
        for field in self.fields:
            if self.fields[field].required:
                label = '*'
            else:
                label = ''
            self.fields[field].label = label

