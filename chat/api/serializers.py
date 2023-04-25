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
    id = serializers.IntegerField(required=False)
    user = serializers.HyperlinkedRelatedField(
        queryset=User.objects.all(),
        view_name='api_user_detail',
        lookup_field='email'
    )

    class Meta:
        model = Answer
        fields = '__all__'
        readonly = ['created_at']


class QuestionSerializer(serializers.ModelSerializer):
    #answer = serializers.SerializerMethodField(source='answer')
    id = serializers.IntegerField(required=False)
    user = serializers.HyperlinkedRelatedField(
        queryset=User.objects.all(),
        view_name='api_user_detail',
        lookup_field='email'
    )

    class Meta:
        model = Question
        fields = '__all__'
        readonly = ['created_at']
    
    # def get_answer(self, obj):
    #     return AnswerSerializer(
    #             obj.answer,
    #             read_only=True,
    #             context=self.context
    #           ).data
    
class QuestionAnswerSerializer(QuestionSerializer):
    answer = AnswerSerializer()


class TopicSerializer(serializers.ModelSerializer):

    user = serializers.HyperlinkedRelatedField(
        queryset=User.objects.all(),
        view_name='api_user_detail',
        lookup_field='email'
    )

    # question = serializers.SerializerMethodField()

    class Meta:
        model = Topic
        fields = '__all__'
        readonly = ['created_at']

    # def get_question(self, obj):
    #     question = Question.objects.filter(
    #         content_type = ContentType.objects.get_for_model(Topic),
    #         object_id = obj.id
    #     )

    #     # Buld question's link
    #     # question_link = [self.context['request'].build_absolute_uri(
    #     #     reverse(
    #     #         'api_questions_by_topic',
    #     #         args=[q.pk]
    #     #     )) for q in question]
    #     # return question_link

    #     return QuestionSerializer(
    #         question, many=True, 
    #         read_only=True, 
    #         context=self.context
    #     ).data

    def validate(self, data):
        if not data.get('slug'):
            data['slug'] = slugify(data['title'])
        return data


class TopicQuestionSerializer(TopicSerializer):
    question = QuestionAnswerSerializer(many=True, read_only=True)


class SingleTopicSerializer(TopicSerializer):
    # Fetch the curent topic's questions on it's question field.
    question = QuestionAnswerSerializer(many=True)

    # Reride the update method.
    def update(self, instance, validated_data):
        # Remove question data.
        question_data = validated_data.pop('question', [])

        # Update the parrent (topic) instance.
        instance = super(SingleTopicSerializer, self).update(instance, validated_data)

        for question_item in question_data:
            # Fetch the question ID
            question_id = question_item.pop('id', None)
            # Update Existed question & answer
            if question_id:
                # Grab question instance.
                question_instance = Question.objects.get(id=question_id)
                # Update the related Answer instance
                answer_data = question_item.pop('answer', {})
                answer_instance = question_instance.answer
                for attr, value in answer_data.items():
                    setattr(answer_instance, attr, value)
                answer_instance.save()

                # Update the rest of the question_instance fields
                for attr, value in question_item.items():
                    setattr(question_instance, attr, value)
                question_instance.save()
            # Create the new question & recive answer for it.
            else:
                # Grab question's text.
                question_text = question_item.pop('content')
        
                # Creat the new answer.
                answer_example_text = "Answer's example text"
                new_answer = Answer(
                    user=self.context['request'].user,
                    content=answer_example_text
                )
                new_answer.save()

                # Create the new Question.
                new_question = Question(
                    user=self.context['request'].user,
                    answer=new_answer,
                    content=question_text,
                    content_object=instance
                )
                new_question.save()

        return instance


# from rest_framework import serializers

# # Question 3, 4, 5: Add any imports you need
# from bakery.api.assessment_serializers import AddressSerializer
# from bakery.models import Food, Customer, Order, Address


# class OrderSerializer(serializers.ModelSerializer):
#     # Question 3: Add your fields here
#     food = serializers.SlugRelatedField(
#         slug_field="name", many=True, queryset=Food.objects.all()
#     )

#     class Meta:
#         model = Order
#         fields = "__all__"


# class CustomerSerializer(serializers.ModelSerializer):
#     # Question 4: Add your fields here
#     address = AddressSerializer()

#     class Meta:
#         model = Customer
#         fields = "__all__"

#     # Question 5: Implement your methods here

#     def create(self, validated_data):
#         address_dict = validated_data.pop("address")
#         address = Address.objects.get_or_create(**address_dict)[0]
#         validated_data["address"] = address
#         return super(CustomerSerializer, self).create(validated_data)

#     def update(self, instance, validated_data):
#         address_dict = validated_data.pop("address")
#         super(CustomerSerializer, self).update(instance, validated_data)

#         if (
#             instance.address.street_name != address_dict["street_name"]
#             or instance.address.city != address_dict["city"]
#         ):
#             address = Address.objects.get_or_create(**address_dict)[0]
#             instance.address = address
#             instance.save()

#         return instance



