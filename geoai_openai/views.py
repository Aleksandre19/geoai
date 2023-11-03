from django.conf import settings
from asgiref.sync import sync_to_async

from chat.models import Question, Topic
from geoai_openai.models import Parameters

import openai

openai.api_key = settings.OPENAI_API_KEY

class OpenAI:
    """
    This class is used to call the OpenAI API.
    """
    def __init__(self, question, slug, topic, user, chat_lang):
        self.question = question
        self.slug = slug
        self.topic = topic
        self.user = user
        self.chat_lang = chat_lang 
    
        self.answer = None
        self.usage = None
        self.created = None
        self.api_param = None

    # Class method to call the class asynchronously.
    @classmethod 
    async def call(cls, question, slug, topic,modele, chat_lang):
        instance = cls(question, slug, topic, modele, chat_lang)
        await instance.api_request()
        return instance   

    # OpenAI API request.
    async def api_request(self):
        # Parameters for the API.
        self.api_param = await self.api_parameters()

        # List of th previous Q/A.      
        messages = await self.messages()

        # Call API Completion.
        response = openai.ChatCompletion.create(
            model=f'{self.api_param.model}',
            messages=messages,
            temperature=self.api_param.temperature,
            top_p=self.api_param.top_p,
        )

        # Grab answer and tokens.
        self.answer = response['choices'][0]['message']['content']
        self.usage = response['usage']

    # Get Openai API completion parameters.
    @sync_to_async(thread_sensitive=True)
    def api_parameters(self):
        return Parameters.objects.select_related('model', 'model__model').get(user=self.user)
    
    # Construct the messages for API endpoint.
    async def messages(self):
        # Embed the system prompt.
        topic_msg = self.system_prompt()

        # If the topic exists, append the previous messages.
        if self.topic:
            await self.append_prev_messages(topic_msg)

        # Append the current question.
        topic_msg.append(self.current_question())

        # Return fully constructed messages.
        return topic_msg

    # Define system prompt.
    def system_prompt(self):
        return [{'role': 'system', 'content': f'{self.api_param.instruction}'}]
    
    # Contruct the previous messages for API.
    async def append_prev_messages(self, msg):
        questions = await self.fetch_questions()
        await self.for_loop_questions(msg, questions)

    # Fetch the questions.
    @sync_to_async(thread_sensitive=True)
    def fetch_questions(self):
        return list(Question.objects.select_related('answer').filter(topic=self.topic))
      
    # Loop through the questions and append to the message list.
    async def for_loop_questions(self, msg, questions_list):
        for question in questions_list:
            user_question = {'role': 'user', 'content': question.translated}
            msg.append(user_question)
            ai_answer = {'role': 'assistant', 'content': question.answer.eng_content}
            msg.append(ai_answer)

    # Define current question.
    def current_question(self):
        return {'role': 'user', 'content': self.question}