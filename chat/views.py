import logging

from django.shortcuts import get_object_or_404, redirect
from django.utils.text import slugify
from django.views.generic import ListView
from django.contrib.auth.mixins import LoginRequiredMixin

from asgiref.sync import sync_to_async, async_to_sync 

from chat.models import Topic, Answer, Question
from chat.forms import QuestionForm

from geoai_translator.views import Translator
from geoai_openai.views import OpenAI

from .helpers import *

logger = logging.getLogger(__name__)

# Notes
#1 Complite caching the questions and answers.
    # subject caching is implemented.
#2 Write a conditions for the else:
#3 Use DjDT debug to optimaze performance of the webpage

class ChatView(LoginRequiredMixin, ListView):

    # Define the model and template to be used.
    template_name = 'chat/index.html'
    model = Topic

    def get_queryset(self):
        """
        Returns the QuerySet that will be used to retrieve the objects.
        """
        slug = self.kwargs.get('slug')
        if slug:
            # Filter the QuerySet based on user and slug if slug exists.
            return Topic.objects.filter(user = self.request.user, slug=slug)
        else:
            # If no slug, return all Topics of the user
            return Topic.objects.filter(user = self.request.user)
        
    
    def get_context_data(self, **kwargs):
        """
        Returns the context data to be used in the template.
        """
        context = super().get_context_data(**kwargs)

        # Get the topics of the current user.
        titles = Topic.objects.filter(user=self.request.user)
        # Get the slug from the URL.
        slug = self.kwargs.get('slug')
        # Define the questions.
        questions = None

        if slug:
            # If slug exists, get the Topic object and its related Questions.
            topic = get_object_or_404(Topic, slug=slug)
            questions = Question.objects.prefetch_related('answer').filter(topic=topic)

        ##### FOR TESTING #####
        # test =  Question.objects.last()
        # ex = exclude_code(test.answer.eng_content)
        # inc = include_back_code(ex['text'])
        # post_question(test.topic)

        context.update({
                'topics': titles,
                'questions': questions,
                'question_form': QuestionForm(),
                'user_id': self.request.user.id,
                'slug': slug,
                #'test': inc,
        })
        return context
    

    def post(self, request, *args, **kwargs):
        """
        Handles the POST requests
        """
        # Get the slug from the URL.
        slug = self.kwargs.get('slug')

        # Get the Topic object if slug exists.
        topic = None
        if slug:
            # If slug exists, get the Topic object and its related Questions.
            topic = get_object_or_404(Topic, slug=slug)
             
        # Grab the content from the form.
        form = Form(request, topic).content()

        # Call the APIs (Openai and Google Translate)  
        api = async_to_sync(Apis.call)(
                user=request.user, 
                question=form['content'],
                slug=slug,
                topic=topic,
                openai_model='gpt-3.5-turbo'
            )

        # Insert the content to the database.
        InsertIntoDB( 
            user=api.user, 
            slug=api.slug, 
            geo_qst=api.question,
            eng_qst=api.geo_eng,
            geo_res=api.final_res,
            eng_res=api.openAI.answer
        )

        # Redirect based on whether slug exists or not.
        return redirect('topic', slug=api.slug)


class Form:
    """
    Handles content grabbing from the question form.
    """
    def __init__(self, request, topic):
        self.topic = topic
        self.request = request

    # Grab the content from the form.
    def content(self):
        form = QuestionForm(self.request.POST, topic=self.topic)
        if form.is_valid():
            return form.clean()
        else: return False
        

class Apis:
    """
    This class takes question, translates it into english by Google Translate API, 
    sends it to OpenAI, excludes the code from the OpenAI response if it exists, 
    translates the response back to georgian, includes back the excluded code
    and returns the final response.
    """
    def __init__(self, user, question, slug, topic, openai_model):
        self.user = user # Current user.
        self.question = question # Original question.
        self.slug = slug # Slug of the topic.
        self.topic = topic # Topic object.
        self.openai_model = openai_model # OpenAI model version.
        self.geo_eng = None # Question translated from geo to eng.
        self.eng_geo = None # Response translated from eng to geo.
        self.openAI = None # OpenAI response.
        self.without_code = None # Response without code snippet.
        self.final_res = None # Final response (translated and with code snippet)

    @classmethod
    async def call(cls, user, question, slug, topic, openai_model):
        inst = cls(user, question, slug, topic, openai_model)
        await inst.apis()
        return inst


    async def apis(self):
        # Translate question from geo to eng.
        self.geo_eng = await self.translator(self.question, 'ka', 'en-US')
        
        # Get response from OpenAI.
        self.openAI = await self.openai()
      
        # Exclude code (if it is in) from the response.
        self.without_code = exclude_code(self.openAI.answer)['text']

        # Translate response from eng to geo.
        self.eng_geo = await self.translator(self.without_code, 'en-US', 'ka')

        # Include code (if it is in) in the response.
        self.final_res = include_back_code(self.eng_geo.result)

        # Generate slug.
        self.gen_slug()

    # Google Translate API.
    async def translator(self, text, from_lan, to_lan):
        return await Translator.create(text, from_lan, to_lan)

    # OpenAI API.
    async def openai(self):
        return await OpenAI.call(
            self.geo_eng.result, 
            self.slug,
            self.topic,
            self.openai_model
        )

    # Generate slug.
    def gen_slug(self):
        if not self.slug:
            self.slug = slugify(self.geo_eng.result[:20])


class InsertIntoDB:
    """
    Handles inserting the content into the database 
    for topic, question and answer models.
    """
    def __init__(self, user, slug, geo_qst, eng_qst, geo_res, eng_res):
        self.user = user # Current user.
        self.slug = slug # Slug of the topic.
        self.topic = self.grab_topic() # Topic object.
        self.topic_id = None # Inserted topic id.
        self.geo_qst = geo_qst # Question in georgian.
        self.eng_qst = eng_qst.result # Question in english.
        self.geo_res = geo_res # Response in georgian.
        self.eng_res = eng_res # Response in english.
        self.inserted_qst = None # Inserted question.
        self.process_insertion() # Insert the content into the database.

    # Process insertion of models.
    def process_insertion(self):
        self.insert_topic()
        self.insert_question()
        self.insert_response()
        self.add_to_cache() # Add to cache.

    # Create topic if it does not exist.
    def insert_topic(self):
        if not self.topic:
            topic_title = self.geo_qst[:15]
            self.topic = Topic(user=self.user,
                    title=topic_title,slug=self.slug)     
            self.topic.save()
            # Store the inserted topic id for websockets.
        self.topic_id = self.topic.id

    # Insert question.
    def insert_question(self):
        self.inserted_qst = Question(
                user=self.user, topic=self.topic, 
                content=self.geo_qst, translated=self.eng_qst)
        self.inserted_qst.save()

    # Insert response.
    def insert_response(self):
        insert_res = Answer(
                user=self.user, question=self.inserted_qst, 
                geo_formated_content=self.geo_res, # Formated response in georgian.
                geo_unformated_content=self.geo_res, # This at this moment is just a placeholder.
                eng_content=self.eng_res)
        insert_res.save()

    # Grab topic if slug exists.
    def grab_topic(self):
        try:
            topic = Topic.objects.get(slug=self.slug)
        except:
            topic = None
        return topic
    
    # Add to cache.
    def add_to_cache(self):
        add_to_cache(self.topic)



class ChatWebSocket:
    """
        This class is used by the WebSocket consumer to handle 
        the I/O operations. It calls the APIs (Openai and Google Translate),
        inserts the content to the database and returns the response to the client.
    """
    def __init__(self, user, question, slug):
        self.user = user
        self.question = question
        self.slug = slug
        self.openai_model = 'gpt-3.5-turbo'
        self.api = None
        self.db_result = None
        self.response = None
        self.topic_id = None

    @classmethod    
    async def call(cls, user, question, slug):
        inst = cls(user, question, slug)
        await inst.websocket()
        return inst
    
    # Websocket handler.
    async def websocket(self):
        # Check if user is authenticated.
        if self.user.is_anonymous: return

        # Fetch the topic.    
        topic = await self.fetch_topic()

        # Call the APIs (Openai and Google Translate)
        self.api =  await Apis.call(self.user, self.question, self.slug, topic, self.openai_model)

        # Insert the content to the database.
        await self.InsertIntoDB()

        # Prepare a response to be sent to the client.
        await self.responses_to_client()

    # Fetch the topic.
    @sync_to_async(thread_sensitive=True)
    def fetch_topic(self):
        try:
            return get_object_or_404(Topic, slug=self.slug)
        except Http404:
            return None
    
    # Insert the content into the database.
    async def InsertIntoDB(self):
        self.db_result = await sync_to_async(InsertIntoDB)( 
            user=self.api.user, 
            slug=self.api.slug, 
            geo_qst=self.api.question,
            eng_qst=self.api.geo_eng,
            geo_res=self.api.final_res,
            eng_res=self.api.openAI.answer
        )

    # Prepare a response to be sent to the client.
    async def responses_to_client(self):
        self.response = self.db_result.geo_res
        self.topic_id = self.db_result.topic_id
