import json

from channels.generic.websocket import AsyncWebsocketConsumer
from chat.views import ChatWebSocket

class ChatConsumer(AsyncWebsocketConsumer):
    """"
    This class is the consumer for the websocket.
    """
    async def connect(self, slug=None):
        if self.scope['user'].is_authenticated:
            await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        # Get the data from the client.
        text_data_json = json.loads(text_data)
        # Get the message.
        message = text_data_json["message"]
        # Get the slug.
        slug = text_data_json["slug"]
        # Call the ChatWebSocket class.
        result = await ChatWebSocket.call(self.scope['user'], message, slug)

        # Get the response.
        response = result.response
        slug = result.slug
        topic_id = result.topic_id

        # Send the response to the client.
        await self.send(text_data=json.dumps({"message": response, 'slug':slug, 'topicID':topic_id}))