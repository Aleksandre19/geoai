from django.db import models
from django.conf import settings 
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation

# Not working gussing because of the version (Django 4.2)
# from versatileimagefield.fields import VersatileImageField, PPOIField

# Create your models here.
class Tag(models.Model):
    value = models.TextField(max_length=100, unique=True, default="Django")
    class Meta:
        ordering = ['value']

    def __str__(self):
        return self.value
    

class Answer(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    geo_formated_content = models.TextField(default="")
    geo_unformated_content = models.TextField()
    eng_content = models.TextField(null=True, blank=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.geo_formated_content[:50] + '...' if len(self.geo_formated_content) > 50 else self.geo_formated_content
   

class Question(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, default=None, related_name='question')
    content = models.TextField()
    translated = models.TextField(null=True, blank=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField(db_index=True)
    content_object = GenericForeignKey("content_type", "object_id")
    tags = models.ManyToManyField(Tag, related_name="question")
    avatar = models.ImageField(
        upload_to="images/avatars",
        null=True, 
        blank=True
    )
    def __str__(self):
        return self.content[:50] + '...' if len(self.content) > 50 else self.content 


class Topic(models.Model):
    class Meta:
        ordering = ['-created_at']

    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    translated = models.CharField(max_length=255, null=True, blank=True, default=None)
    slug = models.SlugField()
    created_at = models.DateTimeField(auto_now_add=True)
    question = GenericRelation(Question)

    def __str__(self):
        return self.title
    
    
    

