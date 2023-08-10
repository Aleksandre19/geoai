from rest_framework import generics, viewsets 
from geoai_auth.models import User
from chat.models import Topic, Question

from chat.api.permissions import IsOwner

from chat.api.serializers import( 
    TopicSerializer,
    UserSerializer,
    QuestionSerializer,
)

class UserDetail(generics.RetrieveAPIView):
    lookup_field = 'id'
    queryset = User.objects.all()
    serializer_class = UserSerializer
    #permission_classes = [IsOwner]

    # User based filtering
    def get_queryset(self):
        return self.queryset.filter(
            email=self.request.user.email
        )
    

class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [IsOwner]


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsOwner]

    # User based filtering
    def get_queryset(self):
        return self.queryset.filter(
            user=self.request.user
        )