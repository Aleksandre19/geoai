import logging
from typing import Any, Dict
from django.db.models.query import QuerySet

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required


from chat.models import Topic, Answer, Question
from chat.forms import QuestionForm

from django.utils.text import slugify
from geoai_translator.views import translate_text, Translator
from geoai_openai.views import OpenAI

# from geoai_openai.views import get_openai_response

# from django.utils.safestring import mark_safe

from asgiref.sync import sync_to_async
from openaiapi.client import openai_response  

from .helpers import *


from django.views.generic import ListView
from django.contrib.auth.mixins import LoginRequiredMixin
import asyncio

from chat.api.serializers import QuestionSerializer

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
        
        titles = Topic.objects.filter(user=self.request.user)
        slug = self.kwargs.get('slug')
        questions = None
        questions_json = None

        ##### FOR TESTING #####
        # test =  Question.objects.last()
        # ex = exclude_code(test.answer.eng_content)
        # inc = include_back_code(ex['text'])
        # post_question(test.topic)
        
        if slug:
            # If slug exists, get the Topic object and its related Questions.
            topic = get_object_or_404(Topic, slug=slug)
            questions = Question.objects.prefetch_related('answer').filter(topic=topic)
            questions_json = QuestionSerializer(questions, many=True).data

        context.update({
                'topics': titles,
                'questions': questions,
                'questions_json': questions_json,
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
        topic = get_object_or_404(Topic, slug=slug) if slug else None
             
        # Grab the content from the form.
        form = Form(request, topic).content()

        # Call the APIs (Openai and Google Translate)
        api = asyncio.run(
            Apis.call(
                user=request.user, 
                question=form['content'],
                slug=form['slug'], 
                topic=topic, 
                openai_model='gpt-3.5-turbo',
                webscoket=False 
            )
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
        if slug:
            return redirect('topic', slug=slug)
        else:
            return redirect('chat_home')


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
    def __init__(self, user, question, slug, topic, openai_model, webscoket):
        self.user = user # Current user.
        self.question = question # Original question.
        self.slug = slug # Slug of the topic.
        self.topic = topic # Topic object.
        self.openai_model = openai_model # OpenAI model version.
        self.webscoket = webscoket # Websocket object.
        self.geo_eng = None # Question translated from geo to eng.
        self.eng_geo = None # Response translated from eng to geo.
        self.openAI = None # OpenAI response.
        self.without_code = None # Response without code snippet.
        self.final_res = None # Final response (translated and with code snippet)

    @classmethod
    async def call(cls, user, question, slug, topic, openai_model, webscoket):
        inst = cls(user, question, slug, topic, openai_model, webscoket)
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
            self.openai_model, 
            self.webscoket
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

async def websocket_chat(user, message, slug):
    if user.is_authenticated:
        openai_model='gpt-3.5-turbo'
        topic = None
        print('SLUG IN WEBSOCKET =====================', slug)
        # !!! Here new slug comes from front and it can't grab topic by new
        # slug, because topic has not been created yet !!!
        if slug:
            print('IF SLUG =====================')
            topic = await sync_to_async(get_object_or_404)(Topic, slug=slug)
        print('Topic in WebSocket =====================', topic)
        api =  await Apis.call(user, message, slug, topic, openai_model, webscoket=True)
        
        print('eng_res=api.openAI.answer =====================', api.openAI.answer)
        result = await sync_to_async(InsertIntoDB)( 
            user=api.user, 
            slug=api.slug, 
            geo_qst=api.question,
            eng_qst=api.geo_eng,
            geo_res=api.final_res,
            eng_res=api.openAI.answer
        )
        print('RESULT =====================')
        # result = api_caller(user, message, slug)
        return result


@sync_to_async
def async_get_object_or_404(slug):
    try:
        topic = get_object_or_404(Topic, slug=slug)
    except Http404:
        topic = None
    return topic
#########################

# def get_all_topics_by_user(request):
#     user_topics = Topic.objects.filter(user=request.user)
#     topics_by_user = {f"topic_{topic.pk}": topic for topic in user_topics}
#     return topics_by_user


# def get_topic(slug):
#     try:
#         topic = get_object_or_404(Topic, slug=slug)
#     except Http404:
#         topic = None
#     return topic





# @login_required
# def post_question(request, topic=None):
#     form = QuestionForm(request.POST, topic=topic)
#     if form.is_valid():
#         form_cont = form.clean();
#         print('===================================', form_cont['content'])
#         api_caller(request.user, form_cont['content'], form_cont['slug'])
#     else: return False

    #     # add_topic = topic
    #     # Grab content from the form element.
    #     question_content =  question_form.cleaned_data['content']
    #     if topic:
    #         slug = topic.slug

    #     if not topic:
    #         convert_alphabet = convertToEng(question_content[:15])
    #         slug = slugify(convert_alphabet)
            
    #     # Call OpenAi API & Google Translate API.
    #     api_caller(request.user, question_content, slug)
    
    #     return {
    #         "slug": slug
    #     }
    # else:
    #     # ATTANTION - Needs to be edited
    #     return False






    



# async def api_caller(user, geo_question, slug, topic):
#     print('QUESTION =========================================', geo_question)
#     # Translate from GEO to ENG.
#     # eng_question = translate_text(geo_question, 'ka', 'en-US')
#     eng_question = await Translator.create(geo_question, 'ka', 'en-US')
#     print('TEXT =========================================')
#     print(eng_question.text)
#     print('TEXT =========================================')
#     if not eng_question:
#             print('=========================================')
#             logger.error("Couldn't translate from Geo to Eng.")
#             print('=========================================')
#             return

#     # Call a Openai API.
#     print('BEGINNING OF OPENAPI =========================================')
#     api_model = 'gpt-3.5-turbo'
#     unformated_eng_response = await OpenAI.call(eng_question.text, slug, topic, api_model)
#     print('RESPONSE')
#     pprint.pprint(unformated_eng_response.answer)
#     # unformated_eng_response = openai_response(eng_question.text, slug)
#     print('END OF OPENAPI =========================================')
#     if not unformated_eng_response:
#         logger.error("Couldn't get the response from the OpenAI.")
#         return
    
#     response_exclude_snippet = exclude_code(unformated_eng_response.answer)['text']

#     # Translate from ENG to GEO.
#     # geo_response_without_snippet = translate_text(
#     #     response_exclude_snippet,
#     #     'en-US', 'ka')
#     geo_response_without_snippet = await Translator.create(
#         response_exclude_snippet,
#         'en-US', 'ka')
    
#     print('GEO TO ENG TRANSLATED TEXT =========================================')
#     pprint.pprint(geo_response_without_snippet.text)
#     print('END GEO TO ENG TRANSLATED TEXT =========================================')
    
#     if not geo_response_without_snippet:
#         logger.error("Couldn't translate from Eng to Geo.")
#         return
    
#     response_return_snippet = include_back_code(geo_response_without_snippet.text)
#     unformated_geo_response = response_return_snippet

#     formated_geo_response = response_return_snippet
#     # formated_geo_response = text_format(response_return_snippet)
#     # Reassembly the translated text and the extracted content.
#     print('FORMATED RESPONSE =========================================')
#     pprint.pprint(response_return_snippet)
#     print('END FORMATED RESPONSE =========================================')
#     if not slug:
#         slug = slugify(eng_question[:20])


#     return {
#         'user': user,
#         'slug': slug,
#         'geo_question': geo_question,
#         'eng_question': eng_question,
#         'formated_geo_response': formated_geo_response,
#         'unformated_geo_response': unformated_geo_response,
#         'unformated_eng_response': unformated_eng_response.answer,
#     }

#     result = insert_content(
#         topic, user, slug, 
#         geo_question,
#         eng_question,
#         formated_geo_response,
#         unformated_geo_response,
#         unformated_eng_response
#     )

#     return {
#         # 'question': {
#         #     'geo': message,
#         #     'eng': question_geo_to_eng,
#         # },
#         'response': {
#             'geo': formated_geo_response,
#             'eng': unformated_eng_response,
#             'slug': slug,
#             'topic_id': result['topic_id'],
#         }
#     }

