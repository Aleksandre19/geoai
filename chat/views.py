import logging

from django.shortcuts import get_object_or_404, redirect
from django.http import HttpResponse
from django.utils import translation
from django.utils.text import slugify
from django.utils.decorators  import method_decorator
from django.views.generic import ListView
from django.views import View
from django.views.i18n import  set_language
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required

from asgiref.sync import sync_to_async, async_to_sync 

from chat.models import Topic, Answer, Question
from chat.forms import QuestionForm
from user_setting.models import UserTokens

from geoai_translator.views import Translator
from geoai_openai.views import OpenAI
from geoai_openai.forms import ParameterForm
from geoai_openai.models import Parameters

from langdetect import detect
import tiktoken

from .helpers import *

logger = logging.getLogger(__name__)

# Notes
# !!! When a chatting language is english, typeing question in 
# other languages than English must be denied. !!!

# 1. Complite caching the questions and answers.
    # subject caching is implemented.
# 2. Use DjDT debug to optimaze performance of the webpage

class ChatView(LoginRequiredMixin, ListView):

    # Define the model and template to be used.
    template_name = 'chat/index.html'
    model = Topic

    def get_queryset(self):
        """
        Returns the QuerySet that will be used to retrieve the objects.
        """

        # Set user interface language.
        user_lang = self.request.user.setting.interface_lang
        translation.activate(user_lang)
        self.request.session['django_language'] = user_lang

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

        # User tokens.
        tokens = get_object_or_404(UserTokens, user=self.request.user)
        remaining_tokens = tokens.value - tokens.used

        # Get the slug from the URL.
        slug = self.kwargs.get('slug')

        # Define the questions.
        questions = None

        if slug:
            # If slug exists, get the Topic object and its related Questions.
            topic = get_object_or_404(Topic, slug=slug)
            questions = Question.objects.prefetch_related('answer').filter(topic=topic)

        
        # Openai API parameters.
        param = Parameters.objects.get(user=self.request.user)

        # Pre-field parameters form for current user.
        param_form = ParameterForm(instance=param)

        ##### FOR TESTING #####
        # test =  Question.objects.last()
        # ex = ExcludeCode.to(test.answer.eng_content)
        # inc = IncludeCode.to(ex)

        context.update({
                'topics': titles,
                'questions': questions,
                'question_form': QuestionForm(),
                'user_id': self.request.user.id,
                'user_setting': self.request.user.setting,
                'slug': slug,
                'tokens': remaining_tokens,
                'param_form': ParameterForm(instance=param),
                # 'test': inc,
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
                # openai_model='gpt-3.5-turbo'
                openai_model='gpt-4'
            )
        
        # Insert the content to the database.
        InsertIntoDB( 
            user=self.api.user, 
            slug=self.api.slug, 
            original_question=self.api.question, # Question on user chatting language (chat_lang).
            translated_question=self.api.geo_eng.result, # Translated question to Eng.
            original_response=self.api.openAI.answer, # Original API response.
            formatted_response=self.api.final_res, # Formatted API response.
            usage=self.api.openAI.usage, 
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
    def __init__(self, user, original_question, slug, topic):
        self.user = user # Current user.
        self.original_question = original_question # Original question.
        self.slug = slug # Slug of the topic.
        self.topic = topic # Topic object.
        self.geo_eng = None # Question translated from geo to eng.
        self.enougth_tokens = True
        self.eng_geo = None # Response translated from eng to geo.
        self.openAI = None # OpenAI response.
        self.without_code = None # Response without code snippet.
        self.final_res = None # Final response (translated and with code snippet)
        self.errorMsg = ''

    @classmethod
    async def call(cls, user, original_question, slug, topic):
        inst = cls(user, original_question, slug, topic)
        await inst.apis()
        return inst

    async def apis(self):
        # Detect question language.
        self.chat_lang = await Translator.detect_lang(self.original_question)

        # Check if types language by user is supported.
        if self.chat_lang not in self.supported_lang():
            self.errorMsg = 'That language is not supported. Please refresh the page and try with othe Language.'
            return
        
        # Translate question if it is not in English.
        if self.chat_lang != 'en':
            self.geo_eng = await self.translator(
                self.original_question, 
                f'{self.chat_lang}', 
                'en-US'
            )

        if not await self.user_has_tokens():
            self.enougth_tokens = False
            self.errorMsg = "You don't have enought tokens to procceed the following action. Pleas purchase the tokens."
            return
        
        # Get response from OpenAI.
        self.openAI = await self.openai()

        # Exclude code (if it is in) from the response.
        self.without_code = ExcludeCode.to(self.openAI.answer, self.chat_lang)

        if self.chat_lang != 'en':
            # Translate response from eng to geo.
            self.eng_geo = await self.translator(self.without_code, 'en-US', f'{self.chat_lang}')
            self.without_code = self.eng_geo.result

        # Include code (if it is in) in the response.
        self.final_res = IncludeCode.to(self.without_code, self.chat_lang)

        # Generate slug.
        self.gen_slug()

    # Google translator API supported languages.
    def supported_lang(self):
        supported_languages = [
            "af", "sq", "am", "ar", "hy", "as", "ay", "az", "bm", "eu", "be", "bn",
            "bho", "bs", "bg", "ca" "ceb", "zh-CN", "zh-TW", "co", "hr", "cs", "da",
            "dv", "doi", "nl", "en", "eo", "et", "ee", "fil", "fi", "fr", "fy", "gl",
            "ka", "de", "el", "gu", "ht", "ha", "iw", "hi", "hmn", "hu", "is", "ig",
            "id", "ga", "it", "ja", "jv", "kn", "kk", "km", "ko", "ku", "ky", "lo", "lv",
            "lt", "lg", "lb", "mk", "mg", "ms", "ml", "mt", "mi", "mr", "mn", "my", "ne",
            "no", "ny", "or", "ps", "fa", "pl", "pt", "pa", "qu", "ro", "ru", "sm", "gd",
            "sr", "st", "tn", "sn", "sd", "si", "sk", "sl", "so", "es", "su", "sw", "sv", "tl",
            "tg", "ta", "te", "th", "tr", "tk", "uk", "ur", "ug", "uz", "vi",  "cy", "xh","yi",
            "yo","zu", 
        ]
    
        return supported_languages

    # Grab user chat language (communication to API).
    @sync_to_async(thread_sensitive=True)
    def get_chat_lang(self):
        chat_lang = self.user.setting.chat_lang
        return chat_lang

    # Google Translate API.
    async def translator(self, text, from_lan, to_lan):
        return await Translator.create(text, from_lan, to_lan)

    # Tokenize the question and check if
    # the user has enougth tokens.
    async def user_has_tokens(self):
        tokenized = await self.tokenize_question()
        user_tokens = await self.user_tokens()
        remaining_tokens = user_tokens.value - user_tokens.used

        if (remaining_tokens - 100) <= len(tokenized):
            return None
        return True         

    # Tokenize the question.
    async def tokenize_question(self):
        api_params = await self.api_parameters()
        openai_tokenizer = tiktoken.get_encoding("cl100k_base")
        openai_tokenizer = tiktoken.encoding_for_model(f'{api_params.model}')
        tokenized = openai_tokenizer.encode(self.original_question)
        return tokenized
    
    # Get Openai API completion parameters.
    @sync_to_async(thread_sensitive=True)
    def api_parameters(self):
        return Parameters.objects.select_related('model', 'model__model').get(user=self.user)
    

    # Grab user remaining tokens.
    @sync_to_async(thread_sensitive=True)
    def user_tokens(self):
        try:
            user_token = get_object_or_404(UserTokens, user=self.user)
            return user_token
        except Http404:
            return None

    # OpenAI API.
    async def openai(self):
        api_question = self.original_question

        # Send the translated question if it is not in English.
        if self.chat_lang != 'en':
            api_question = self.geo_eng.result

        return await OpenAI.call(
            api_question, 
            self.slug,
            self.topic,
            self.user,
            self.chat_lang
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
    def __init__(
            self, user, slug, 
            original_question,
            translated_question, 
            original_response,
            formatted_response,
            usage
        ):
        
        self.user = user # Current user.
        self.slug = slug # Slug of the topic.
        self.topic = self.grab_topic() # Topic object.
        self.topic_id = None # Inserted topic id.
        self.original_question = original_question # Eng or Geo question.
        self.translated_question = translated_question # Question in english.
        self.formatted_response = formatted_response # Styled Geo or Eng API response.
        self.original_response = original_response # Original API answer.
        self.tokens = usage # Token usage on particular request.
        self.inserted_qst = None # Inserted question.
        self.remaining_tokens = None # Remaining tokens.
        self.process_insertion() # Insert the content into the database.

    # Process insertion of models.
    def process_insertion(self):
        self.insert_topic()
        self.insert_question()
        self.insert_response()
        self.insert_tokens()
        self.add_to_cache() # Add to cache.

    # Create topic if it does not exist.
    def insert_topic(self):
        if not self.topic:
            topic_title = self.original_question[:15]
            self.topic = Topic(user=self.user,
                    title=topic_title,slug=self.slug)     
            self.topic.save()
            # Store the inserted topic id for websockets.
        self.topic_id = self.topic.id

    # Insert question.
    def insert_question(self):
        self.inserted_qst = Question(
                user=self.user, topic=self.topic, 
                content=self.original_question, translated=self.translated_question)
        self.inserted_qst.save()

    # Insert response.
    def insert_response(self):
        insert_res = Answer(
                user=self.user, question=self.inserted_qst, 
                geo_formated_content=self.formatted_response, # Formated response in georgian.
                geo_unformated_content=self.formatted_response, # This at this moment is just a placeholder.
                eng_content=self.original_response)
        insert_res.save()

    # Update used tokens of the user.
    def insert_tokens(self):
        try:
            user_tokens = UserTokens.objects.get(user=self.user)
            user_tokens.used += self.tokens['total_tokens']
            self.remaining_tokens = user_tokens.value - user_tokens.used
            user_tokens.save()
        except UserTokens.DoesNotExist:
            print("Model doesn't exist")

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
    def __init__(self, user, original_question, slug):
        self.user = user
        self.original_question = original_question
        self.slug = slug
        self.api = None
        self.db_result = None
        self.response = None
        self.topic_id = None
        self.tokens = None
        self.error = ''

    @classmethod    
    async def call(cls, user, original_question, slug):
        inst = cls(user, original_question, slug)
        await inst.websocket()
        return inst
    
    # Websocket handler.
    async def websocket(self):
        # Check if user is authenticated.
        if self.user.is_anonymous: return

        # Fetch the topic.    
        topic = await self.fetch_topic()

        # Call the APIs (Openai and Google Translate)
        self.api =  await Apis.call(
                self.user, 
                self.original_question, 
                self.slug, 
                topic
            )
        
        # Not supported language.
        if self.api.errorMsg:
            self.error = {
                'type': 'lang',
                'message': self.api.errorMsg
            }
            return None

        # Tokens limit error.
        if not self.api.enougth_tokens:
            self.error = {
                'type': 'token',
                'message': self.api.errorMsg
            }
            return None

        # Insert the content to the database.
        await self.insertIntoDB()

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
    async def insertIntoDB(self):

        if self.api.chat_lang != 'en':
            translated_question = self.api.geo_eng.result
        else:
            translated_question = self.original_question

        self.db_result = await sync_to_async(InsertIntoDB)( 
            user=self.api.user, # Current user.
            slug=self.api.slug,  # Slug.
            original_question=self.original_question, # Question on user chatting language (chat_lang).
            translated_question=translated_question, # Translated question to Eng.
            original_response=self.api.openAI.answer, # Original API response.
            formatted_response=self.api.final_res, # Formatted API response.
            usage=self.api.openAI.usage, # Current used tokens.     
        )

        # user=api.user, 
        # slug=api.slug, 
        # geo_qst=api.question, # Eng or Geo question.
        # geo_res=api.final_res, # Styled Geo or Eng API response.
        # eng_res=api.openAI.answer, # Original API answer.
        # usage=api.openAI.usage,
        # eng_qst=api.geo_eng, # Translated question from Geo to Eng. 

    # Prepare a response to be sent to the client.
    async def responses_to_client(self):
        self.response = self.db_result.formatted_response
        self.topic_id = self.db_result.topic_id
        self.tokens = self.db_result.remaining_tokens


@method_decorator(login_required, name='dispatch')
class CustomSetLang(View):
    """
    This class overrides the set_language function and updates 
    the languages for chat (communicating to AI API) and interface, respectively.
    """
    def post(self, request, *args, **kwargs):
        
        # Call set_language function.
        response  = set_language(request)

        # Grab language and model field name.
        lang = request.POST.get('language')
        field = request.POST.get('field')

        if not lang and not field:
            return response
        
        user = request.user
        # Update language for communicating to AI API.
        if field == 'chat':
            user.setting.chat_lang = lang
        
        # Update interface language.
        if field == 'interface':
            user.setting.interface_lang = lang

        user.setting.save()

        return response