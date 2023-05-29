import json

from django.shortcuts import get_object_or_404

from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async

from chat.models import Topic
from chat.views import websocket_chat

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self, slug=None):
        if self.scope['user'].is_authenticated:
            self.slug = self.scope['url_route']['kwargs'].get('slug', None)
            await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        #topic = await database_sync_to_async(get_object_or_404)(Topic, slug=self.slug)

        result = await sync_to_async(websocket_chat)(self.scope['user'], message, self.slug)
        response = result['response']['geo']
        slug = result['response']['slug']
        await self.send(text_data=json.dumps({"message": response, 'slug':slug}))