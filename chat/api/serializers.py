from geoai_auth.models import User
from rest_framework import serializers
from chat.models import Topic


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