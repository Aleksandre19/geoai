from django.conf import settings
from asgiref.sync import sync_to_async, async_to_sync
from chat.models import Question
from chat.api.serializers import QuestionSerializer
from rest_framework.exceptions import ValidationError
import json
import openai
import pprint


openai.api_key = settings.OPENAI_API_KEY

class OpenAI:
    """
    This class is used to call the OpenAI API.
    """
    def __init__(self, question, slug, topic, qst_json, modele):
        self.question = question
        self.slug = slug
        self.topic = topic
        self.modele = modele
        self.qst_json = qst_json
        self.temperature = 0.3   
        self.answer = None


    # Class method to call the class asynchronously.
    @classmethod 
    async def call(cls, question, slug, topic, qst_json, modele):
        instance = cls(question, slug, topic, qst_json, modele)
        await instance.api_request()
        return instance   

    # OpenAI API request.
    async def api_request(self):
        messages = await self.messages()
        response = openai.ChatCompletion.create(
            model=self.modele,
            messages=messages,
            temperature=self.temperature,
        )
        self.answer = response['choices'][0]['message']['content']
    
    # Construct the messages for API endpoint.
    async def messages(self):
        # Embed the system prompt.
        topic_msg = self.system_prompt()

        # Validate the json data.
        validated_data = self.validate_json_data()

        # Loop through the validated json data.
        self.loop_json_data(topic_msg, validated_data)
        
        # Append the current question.
        topic_msg.append(self.current_question())

        # Return fully constructed messages.
        return topic_msg

    # Define system prompt.
    def system_prompt(self):
        return [{'role': 'system', 'content': 'You are a helpful assistant.'}]

    # Validate the json data.
    def validate_json_data(self):
        # Validate the json data by DRF serializer.
        serializer = QuestionSerializer(data=self.qst_json, many=True)

        # Raise validation error if not valid.
        if not serializer.is_valid():
            raise ValidationError(serializer.errors)
        
        # Return validated data.
        return serializer.validated_data
    
    # Loop through the validated json data.
    def loop_json_data(self, msg, validated_data):
        # Convert ordered dict to json.
        json_data = json.dumps(validated_data, ensure_ascii=False)

        # Convert json to python object.
        parsed_data = json.loads(json_data)

        for item in parsed_data:
            # Get the question and answer.
            question = item.get('translated', None)
            answer = item.get('answer', {}).get('eng_content', None)

            # Append the question and answer to the messages.
            if question:
                user_question = {'role': 'user', 'content': question}
                msg.append(user_question)

            if answer:
                ai_answer = {'role': 'assistant', 'content': answer}
                msg.append(ai_answer)

    # Define current question.
    def current_question(self):
        return {'role': 'user', 'content': self.question} 



# class OpenAI:
#     """
#     This class is used to call the OpenAI API.
#     """
#     def __init__(self, question, slug, topic, modele, webscoket):
#         self.question = question
#         self.slug = slug
#         self.topic = topic
#         self.modele = modele
#         self.temperature = 0.3
#         self.webscoket = webscoket    
#         self.answer = None

#     # Method to be accessed outside by async call.
#     @classmethod 
#     async def call(cls, question, slug, topic, modele, webscoket):
#         instance = cls(question, slug, topic, modele, webscoket)
#         await instance.api_request()
#         return instance   

#     # Calls the API and returns the response.
#     async def api_request(self):
#         response = openai.ChatCompletion.create(
#             model=self.modele,
#             messages= await self.messages_async() if self.webscoket else self.messages_sync(),
#             temperature=self.temperature,
#         )
        
#         self.answer = response['choices'][0]['message']['content']
    
#     # Generates messages to be sent to the API.
#     async def messages_async(self):
#         topic_msg = self.system_prompt()  
#         topic_msg = await self.prev_msg_async(topic_msg)
#         topic_msg.append(self.current_question())
#         return topic_msg
    
#     def messages_sync(self):
#         topic_msg = self.system_prompt()  
#         topic_msg = self.prev_msg_sync(topic_msg)
#         topic_msg.append(self.current_question())
#         return topic_msg
    
#     # Generates the system prompt.
#     def system_prompt(self):
#         return [{'role': 'system', 'content': 'You are a helpful assistant.'}]

#     # Generates the current question JSON.
#     def current_question(self):
#         return {'role': 'user', 'content': self.question} 
    
#     # Generates the previous messages.
#     def prev_msg_sync(self, msg):
#         if  not self.topic: return msg
#         questions_list = Question.objects.select_related('answer').filter(topic=self.topic)
#         self.for_loop_questions(msg, questions_list) 
#         return msg

#     async def prev_msg_async(self, msg):
#         # If the topic does not exist, return the current messages.
#         if  not self.topic: return msg
   
#         questions = await sync_to_async(self.fetch_questions)()
#         questions_list = await sync_to_async(list)(questions)

#         self.for_loop_questions(msg, questions_list)
#         return msg 

#     def for_loop_questions(self, msg, questions_list):
#         for question in questions_list:
#             user_question = {'role': 'user', 'content': question.translated}
#             msg.append(user_question)
#             ai_answer = {'role': 'assistant', 'content': question.answer.eng_content}
#             msg.append(ai_answer)

#     def fetch_questions(self):
#         return Question.objects.select_related('answer').filter(topic=self.topic)

# def get_openai_response(content):
#     response = openai.Completion.create(
#         model="text-davinci-003",
#         prompt=content,
#         temperature=0.3,
#     )

#     return response.choices[0].text


# # Example 
# def openai_request(request):
#     api_key = settings.OPENAI_API_KEY
#     url = 'https://api.openai.com/v1/edits'
#     headers = {
#         'Content-Type': 'application/json',
#         'Authorization': f'Bearer {api_key}'
#     }
#     data = {
#         'model': 'text-davinci-edit-001',
#         'input': 'What day of the wek is it?',
#         'instruction': 'Fix the spelling mistakes'
#     }
#     response = requests.post(url, headers=headers, json=data)
#     return JsonResponse(response.json())

# def generate_prompt(content):
#      return """You are the the AI assistant and aswer on the users questions."""