from rest_framework import serializers
from chat.models import Topic, Question, Answer
from django.utils.text import slugify
from geoai_auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.urls import reverse
# from django.core.exceptions import ObjectDoesNotExist

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'
        readonly = ['created_at']


class QuestionSerializer(serializers.ModelSerializer):
    answer = serializers.SerializerMethodField(source='answer')

    class Meta:
        model = Question
        fields = '__all__'
        readonly = ['created_at']
    
    def get_answer(self, obj):
        return AnswerSerializer(
                obj.answer,
                read_only=True,
                context=self.context
              ).data
    

class TopicSerializer(serializers.ModelSerializer):

    user = serializers.HyperlinkedRelatedField(
        queryset=User.objects.all(),
        view_name='api_user_detail',
        lookup_field='email'
    )

    question = serializers.SerializerMethodField()

    class Meta:
        model = Topic
        fields = '__all__'
        readonly = ['created_at']

    def get_question(self, obj):
        question = Question.objects.filter(
            content_type = ContentType.objects.get_for_model(Topic),
            object_id = obj.id
        )

        # Buld question's link
        # question_link = [self.context['request'].build_absolute_uri(
        #     reverse(
        #         'api_questions_by_topic',
        #         args=[q.pk]
        #     )) for q in question]
        # return question_link

        return QuestionSerializer(
            question, many=True, 
            read_only=True, 
            context=self.context
        ).data

    def validate(self, data):
        if not data.get('slug'):
            data['slug'] = slugify(data['title'])
        return data



class SingleTopicSerializer(TopicSerializer):
    question = QuestionSerializer(many=True)


# class TopicSerializer(serializers.ModelSerializer):
#     slug = serializers.SlugField(required=False)

#     user = serializers.HyperlinkedRelatedField(
#         queryset=User.objects.all(),
#         view_name='api_user_detail',
#         lookup_field='email'
#     )

#     class Meta:
#         model = Topic
#         fields = '__all__'
#         readonly = ['created_at']

#     def validate(self, data):
#         if not data.get('slug'):
#             data['slug'] = slugify(data['title'])
#         return data


# class AnswerSerializer(serializers.ModelSerializer):
#     user = serializers.HyperlinkedRelatedField(
#         queryset=User.objects.all(),
#         view_name='api_user_detail',
#         lookup_field='email'
#     )

#     class Meta:
#         model = Answer
#         fields = '__all__'
#         readonly = ['created_at']


# class QuestionSerializer(serializers.ModelSerializer):
#     id = serializers.IntegerField(required=False)
#     answer = AnswerSerializer()
#     class Meta:
#         model = Question
#         fields = '__all__'
#         readonly = ['created_at']


# class TopicDetailSerializer(TopicSerializer):
#     question = QuestionSerializer(many=True)

#     def update(self, instance, validated_data):
#         answer = validated_data.get('question')
#         print()
#         # questions = validated_data.pop('question')
#         # instance = super(TopicDetailSerializer, self).update(instance, validated_data)
#         # for question_data in questions:
#         #     if question_data.get('id'):
#         #         continue
#         #     question = Question(**question_data)
            
#         #     # Get the existing Answer instance
#         #     # answer_data = question_data.get('answer', None)
#         #     # if answer_data and answer_data.get('id'):
#         #     #     try:
#         #     #         answer_instance = Answer.objects.get(id=answer_data['id'])
#         #     #         question.answer = answer_instance
#         #     #     except ObjectDoesNotExist:
#         #     #         print(f"Answer with ID {answer_data['id']} not found in the database.")
#         #     #         pass

#         #     question.user = self.context['request'].user
#         #     question.content_object = instance
#         #     question.save()
#         return instance



