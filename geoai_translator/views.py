from google.cloud import translate

class Translator:
    """
    This class is used to call the Google Translate API.
    """
    def __init__(self, text, from_lan, to_lan):
        self.client = translate.TranslationServiceClient()
        self.location = "global"
        self.project_id = "geoai-translator-test"
        self.parent = f"projects/{self.project_id}/locations/{self.location}"
        self.text = text
        self.from_lan = from_lan
        self.to_lan = to_lan
        self.result = None


    @classmethod
    async def create(cls, text, from_lan, to_lan):
        instance = cls(text, from_lan, to_lan)
        await instance.response()
        return instance

    # Google Translate API request.
    async def response(self):
        result = self.client.translate_text(
            request={
                "parent": self.parent,
                "contents": [self.text],
                "mime_type": "text/plain",  # mime types: text/plain, text/html
                "source_language_code": self.from_lan,
                "target_language_code": self.to_lan,
            }
        )

        self.result = result.translations[0].translated_text
