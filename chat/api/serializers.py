from rest_framework import serializers
from chat.models import Question

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'
        readonly = ['created_at']
