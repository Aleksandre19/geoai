from django.shortcuts import render
from google.cloud import translate

# Create your views here.
def translate_text(text="", slngc="en-US", tlngc="ka", project_id="geoai-translator-test"):
    """Translating Text."""

    client = translate.TranslationServiceClient()

    location = "global"

    parent = f"projects/{project_id}/locations/{location}"

    # Translate text from English to French
    # Detail on supported types can be found here:
    # https://cloud.google.com/translate/docs/supported-formats
    response = client.translate_text(
        request={
            "parent": parent,
            "contents": [text],
            "mime_type": "text/plain",  # mime types: text/plain, text/html
            "source_language_code": slngc,
            "target_language_code": tlngc,
        }
    )

    return response.translations[0].translated_text
    # Display the translation for each input text provided
    # print(response.translations)
    # for translation in response.translations:
    #     print("Translated text: {}".format(translation.translated_text))