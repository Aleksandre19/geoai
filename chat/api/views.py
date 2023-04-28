from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers, vary_on_cookie

from rest_framework import generics, viewsets 
from rest_framework.decorators import action
from rest_framework.response import Response
from chat.api.serializers import( 
    TopicQuestionSerializer, 
    UserSerializer,
    SingleTopicSerializer,
    AnswerSerializer,
    QuestionSerializer
)
from chat.models import Topic, Answer
from chat.api.permissions import IsOwner
from geoai_auth.models import User

#To do list:
# Check permission preblem: obj.user == request.user

class UserDetail(generics.RetrieveAPIView):
    lookup_field = 'email'
    queryset = User.objects.all()
    serializer_class = UserSerializer
    #permission_classes = [IsOwner]


class TopicList(generics.ListAPIView):
    serializer_class = TopicQuestionSerializer
    permission_classes = [IsOwner]

    def get_queryset(self):
        return Topic.objects.filter(user=self.request.user)


class SingleTopic(generics.RetrieveUpdateDestroyAPIView):
    queryset = Topic.objects.all()
    serializer_class = SingleTopicSerializer
    permission_classes = [IsOwner]

    # Caching
    @method_decorator(cache_page(60))
    @method_decorator(vary_on_headers('Authorization'))
    @method_decorator(vary_on_cookie)
    def get(self, *args, **kwargs):
        return super(SingleTopic, self).get(*args, **kwargs)

class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

    @action(methods=['get'], detail=True, name="Answers with the topics")
    def questions(self, request, pk=None):
        answer = self.get_object()
        questions_serializer = QuestionSerializer(
            answer.question, many=True, context={"request": request}
        )
        return Response(questions_serializer.data)
