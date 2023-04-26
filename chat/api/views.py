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
