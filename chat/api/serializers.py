from rest_framework import serializers
from chat.models import Topic

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = '__all__'
        readonly = ['created_at']
