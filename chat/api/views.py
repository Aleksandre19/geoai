from rest_framework import generics
from django.contrib.contenttypes.models import ContentType
# from chat.api.serializers import TopicSerializer, TopicDetailSerializer , UserSerializer#, QuestionSerializer, AnswerSerializer
from chat.models import Topic, Question, Answer
from chat.api.permissions import IsOwner
from geoai_auth.models import User
from chat.api.serializers import TopicSerializer, UserSerializer, QuestionSerializer, AnswerSerializer, SingleTopicSerializer


class UserDetail(generics.RetrieveAPIView):
    lookup_field = 'email'
    queryset = User.objects.all()
    serializer_class = UserSerializer


class TopicList(generics.ListAPIView):
    serializer_class = TopicSerializer
    permission_classes = [IsOwner]

    def get_queryset(self):
        return Topic.objects.filter(user=self.request.user)
    

class QuestionsByTopic(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class AnswerByQuestion(generics.RetrieveUpdateDestroyAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer


class SingleTopic(generics.RetrieveUpdateDestroyAPIView):
    queryset = Topic.objects.all()
    serializer_class = SingleTopicSerializer
    permission_classes = [IsOwner]

# class TopicList(generics.RetrieveAPIView):
#     serializer_class = TopicSerializer
#     def get_queryset(self):
#         return Topic.objects.filter(user=self.request.user)
#     # lookup_field = 'email'
    
#     # def perform_create(self, serializer):
#     #     # Save part of the queston into the topic.
#     #     title = self.request.data['title'][:20]
#     #     slug = self.request.data['title'][:20]
#     #     topic = serializer.save(user=self.request.user, title=title, slug=slug)
#     #     topic.save()
#     #     # Save content into the question model.
#     #     topic_content_type = ContentType.objects.get_for_model(Topic)
#     #     question_serializer = QuestionSerializer(data={
#     #         'user': self.request.user.id,
#     #         'content': self.request.data['title'],
#     #         'content_type': topic_content_type.id,
#     #         'object_id': topic.id
#     #     })


#     #     if question_serializer.is_valid():
#     #         question = question_serializer.save()

#     #         # Fake answer on the question
#     #         answer_text = """
#     #             Lorem ipsum dolor sit amet, consectetur adipiscing elit,
#     #             sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
#     #             Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
#     #             nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
#     #             reprehenderit in voluptate velit esse cillum dolore eu.
#     #         """

#     #         answer_serializer = AnswerSerializer(data={
#     #             'user': self.request.user.id,
#     #             'question': question.id,
#     #             'content': answer_text
#     #         })

#     #         if answer_serializer.is_valid():
#     #             answer_serializer.save()


# class TopicDetail(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Topic.objects.all()
#     serializer_class = TopicDetailSerializer
#     permission_classes = [IsOwner]


