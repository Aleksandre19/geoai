from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers, vary_on_cookie

from datetime import timedelta
from django.http import Http404
from django.utils import timezone

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

    # User based filtering
    def get_queryset(self):
        return self.queryset.filter(
            email=self.request.user.email
        )


class TopicList(generics.ListAPIView):
    serializer_class = TopicQuestionSerializer
    permission_classes = [IsOwner]
    queryset = Topic.objects.all()

    # Filtering
    def get_queryset(self):
        # User based filtering
        queryset = self.queryset.filter(user=self.request.user)
        
        # Time based filtering
        time_period_name = self.kwargs.get('period_name')

        if not time_period_name:
            return queryset
        
        if time_period_name == 'new':
            return queryset.filter(
                created_at__gte=timezone.now() - timedelta(hours=1)
            )
        elif time_period_name == "today":
            return queryset.filter(
                created_at__date=timezone.now().date(),
            )
        elif time_period_name == "week":
            return queryset.filter(created_at__gte=timezone.now() - timedelta(days=7))
        else:
            raise Http404(
                f"Time period {time_period_name} is not valid, should be "
                f"'new', 'today' or 'week'"
            )
        

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
    
    # User based filtering
    def get_queryset(self):
        return self.queryset.filter(
            user=self.request.user
        )

class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

    @action(methods=['get'], detail=True, name="Answers with the topics")
    def questions(self, request, pk=None):
        answer = self.get_object()

        #Paginate
        page = self.paginate_queryset(answer.question.all())
        if page is not None:
            questions_serializer = QuestionSerializer(
                page, many=True, context={"request": request}
            )
            return self.get_paginated_response(questions_serializer.data)
        
        questions_serializer = QuestionSerializer(
            answer.question, many=True, context={"request": request}
        )
        return Response(questions_serializer.data)
    
    # User based filtering
    def get_queryset(self):
        return self.queryset.filter(
            user=self.request.user
        )
    
