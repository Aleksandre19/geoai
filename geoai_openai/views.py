from django.conf import settings
from asgiref.sync import sync_to_async, async_to_sync
from chat.models import Question
import openai


openai.api_key = settings.OPENAI_API_KEY


class OpenAI:
    """
    This class is used to call the OpenAI API.
    """
    def __init__(self, question, slug, topic, modele, webscoket):
        self.question = question
        self.slug = slug
        self.topic = topic
        self.modele = modele
        self.temperature = 0.3
        self.webscoket = webscoket
        print('TOPIC IN __init__ =====================', self.topic)
        
        self.answer = None

    # Method to be accessed outside by async call.
    @classmethod 
    async def call(cls, question, slug, topic, modele, webscoket):
        instance = cls(question, slug, topic, modele, webscoket)
        await instance.api_request()
        return instance   

    async def prepare_message(self):
        if self.webscoket:
            return await self.messages()
        return async_to_sync(self.messages)()
        
    # Calls the API and returns the response.
    async def api_request(self):
        response = openai.ChatCompletion.create(
            model=self.modele,
            messages= await self.prepare_message(),
            temperature=self.temperature,
        )
        
        self.answer = response['choices'][0]['message']['content']
    
    # Generates messages to be sent to the API.
    async def messages(self):
        topic_msg = self.system_prompt()  
        if self.webscoket:
            topic_msg = await self.prev_msg_async(topic_msg)
        else:
            topic_msg = self.prev_msg_sync(topic_msg)
        topic_msg.append(self.current_question())
        return topic_msg
    
    # Generates the system prompt.
    def system_prompt(self):
        return [{'role': 'system', 'content': 'You are a helpful assistant.'}]

    # Generates the current question JSON.
    def current_question(self):
        return {'role': 'user', 'content': self.question} 
    
    # Generates the previous messages.
    def prev_msg_sync(self, msg):
        if  not self.topic: return msg
        questions_list = Question.objects.select_related('answer').filter(topic=self.topic)
        self.for_loop_questions(msg, questions_list) 
        return msg

    async def prev_msg_async(self, msg):
        # If the topic does not exist, return the current messages.
        if  not self.topic: return msg
   
        questions = await sync_to_async(self.fetch_questions)()
        questions_list = await sync_to_async(list)(questions)

        self.for_loop_questions(msg, questions_list)
        return msg 

    def for_loop_questions(self, msg, questions_list):
        for question in questions_list:
            user_question = {'role': 'user', 'content': question.translated}
            msg.append(user_question)
            ai_answer = {'role': 'assistant', 'content': question.answer.eng_content}
            msg.append(ai_answer)

    def fetch_questions(self):
        return Question.objects.select_related('answer').filter(topic=self.topic)

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