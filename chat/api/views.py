from rest_framework import generics
from chat.api.serializers import TopicSerializer
from chat.models import Topic
from chat.api.permissions import IsOwner


class TopicList(generics.ListCreateAPIView):
    serializer_class = TopicSerializer
    def get_queryset(self):
        return Topic.objects.filter(user=self.request.user)


class TopicDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [IsOwner]