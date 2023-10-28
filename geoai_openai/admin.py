from django.contrib import admin

from geoai_openai.models import Parameters, OpenaiModel

class ParametersAdmin(admin.ModelAdmin):
    list_display = ('user', 'model', 'temperature', 'top_p', 'max_tokens')

class OpenaiModelAdmin(admin.ModelAdmin):
    list_display = ('model',)

admin.site.register(Parameters, ParametersAdmin)
admin.site.register(OpenaiModel, OpenaiModelAdmin)
