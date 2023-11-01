from django.db import models
from django.conf import settings

class MaxTokens(models.Model):
    """ List of the max available tokens. """
    token = models.IntegerField()

    def __str__(self):
        return str(self.token)
    

class ModelName(models.Model):
    """ OpenAI model names. """
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    

class OpenaiModel(models.Model):
    """
    Openai API models.
    """
    model = models.ForeignKey(ModelName, on_delete=models.CASCADE, 
                             default=settings.OPENAI_DEFAULT_MODEL)
    token = models.ForeignKey(MaxTokens, on_delete=models.CASCADE, 
                              default=settings.OPENAI_DEFAULT_MODEL_TOKENS)
    
    def __str__(self):
        return str(self.model)


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
        null=False, blank=False, 
        related_name='parameters')
    
    instruction = models.TextField(default=settings.OPENAI_DEFAULT_PROMPT)
    temperature = models.FloatField(default=0.3)
    top_p = models.FloatField(default=0)


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

