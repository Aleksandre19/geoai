from django.db import models
from django.conf import settings



class OpenaiModel(models.Model):
    """
    Openai API models.
    """
    model = models.CharField(max_length=100)


class Parameters(models.Model):
    """"
    Parameters for the Openai API chat completion.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='parameters')
    model = models.ForeignKey(
        OpenaiModel, 
        on_delete=models.CASCADE, 
        null=False, blank=False)
    instruction = models.TextField()
    temperature = models.FloatField()
    top_p = models.FloatField()
    max_tokens = models.IntegerField()


    def save(self, *args, **kwargs):
        """
        Override the models save method to check 
        float capabilities and round it to tenths.
        """
        if self.temperature < 0:
            self.temperature = 0

        if self.top_p < 0:
            self.top_p = 0

        self.temperature = round(self.temperature * 10) / 10.0
        self.top_p = round(self.top_p * 10) / 10.0

        super(Parameters, self).save(*args, kwargs)

