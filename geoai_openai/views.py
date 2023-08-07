from django.conf import settings
import openai


openai.api_key = settings.OPENAI_API_KEY


class OpenAI:
    """
    This class is used to call the OpenAI API.
    """
    def __init__(self, question, slug, topic, modele):
        self.modele = modele
        self.temperature = 0.3
        self.slug = slug
        self.topic = topic
        self.question = question
        self.answer = None

    # Method to be accessed outside by async call.
    @classmethod 
    async def call(cls, question, slug, topic, modele):
        instance = cls(question, slug, topic, modele)
        await instance.api_request()
        return instance   

    # Calls the API and returns the response.
    async def api_request(self):
        response = openai.ChatCompletion.create(
            model=self.modele,
            messages=self.messages(),
            temperature=self.temperature,
        )
        self.answer = response['choices'][0]['message']['content']
    
    # Generates messages to be sent to the API.
    def messages(self):
        topic_msg = self.system_prompt()   
        topic_msg = self.prev_msg(topic_msg)
        topic_msg.append(self.current_question())
        return topic_msg
    
    # Generates the system prompt.
    def system_prompt(self):
        return [{'role': 'system', 'content': 'You are a helpful assistant.'}]

    # Generates the current question JSON.
    def current_question(self):
        return {'role': 'user', 'content': self.question}   
    
    # Generates the previous messages.
    def prev_msg(self, msg):

        # If the topic does not exist, return the current messages.
        if  not self.topic: return msg 

        # If the topic exists, add the previous messages.    
        questions = self.topic.question.all()
        for question in questions:
            user_question = {'role': 'user', 'content': question.translated}
            msg.append(user_question)
            ai_answer = {'role': 'assistant', 'content': question.answer.eng_content}
            msg.append(ai_answer)
        return msg



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