from rest_framework import generics
from chat.api.serializers import TopicSerializer
from chat.models import Question


class TopicList(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = TopicSerializer


class TopicDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = TopicSerializer