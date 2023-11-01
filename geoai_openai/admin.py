from django.contrib import admin

from geoai_openai.models import Parameters, OpenaiModel, MaxTokens, ModelName

class ParametersAdmin(admin.ModelAdmin):
    """ OpenAI API parameters. """
    list_display = ('user', 'model', 'temperature', 'top_p')


class OpenaiModelAdmin(admin.ModelAdmin):
    """ List of available models. """
    list_display = ('model', 'token')


class MaxTokensAdmin(admin.ModelAdmin):
    """ List of max tokens. """
    list_display = ('token', )


class ModelNameAdmin(admin.ModelAdmin):
    """ List of model names. """
    list_display = ('name', )


admin.site.register(Parameters, ParametersAdmin)
admin.site.register(OpenaiModel, OpenaiModelAdmin)
admin.site.register(MaxTokens, MaxTokensAdmin)
admin.site.register(ModelName, ModelNameAdmin)
