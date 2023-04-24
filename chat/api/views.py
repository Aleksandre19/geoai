from rest_framework import generics
from chat.api.serializers import TopicQuestionSerializer, UserSerializer, SingleTopicSerializer
from chat.models import Topic
from chat.api.permissions import IsOwner
from geoai_auth.models import User


class UserDetail(generics.RetrieveAPIView):
    lookup_field = 'email'
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsOwner]


class TopicList(generics.ListAPIView):
    serializer_class = TopicQuestionSerializer
    permission_classes = [IsOwner]

    def get_queryset(self):
        return Topic.objects.filter(user=self.request.user)


class SingleTopic(generics.RetrieveUpdateDestroyAPIView):
    queryset = Topic.objects.all()
    serializer_class = SingleTopicSerializer
    permission_classes = [IsOwner]


