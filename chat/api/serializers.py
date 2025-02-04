from geoai_auth.models import User
from rest_framework import serializers
from chat.models import Topic, Question, Answer
from user_setting.models import UserSetting


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name', 'last_name']


class TopicSerializer(serializers.ModelSerializer):

    user = serializers.HyperlinkedRelatedField(
        queryset=User.objects.all(),
        view_name='api_user_detail',
        lookup_field='id'
    )

    class Meta:
        model = Topic
        fields = '__all__'
        readonly = ['created_at']


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['eng_content']


class QuestionSerializer(serializers.ModelSerializer):
    answer = AnswerSerializer()
    class Meta:
        model = Question
        fields = ['translated', 'answer']


class UserSettingsSerializer(serializers.ModelSerializer):
    user = serializers.HyperlinkedRelatedField(
        queryset=User.objects.all(),
        view_name='api_user_detail',
        lookup_field='id'
    )

    class Meta:
        model = UserSetting
        fields = '__all__'
        readonly = ['user']