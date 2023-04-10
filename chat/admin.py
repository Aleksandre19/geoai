from django.contrib import admin
from chat.models import Topic, Question, Answer

# Register your models here.
class TopictAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug" : ("title",)}
    list_display = ("slug", "created_at")

admin.site.register(Topic, TopictAdmin)
admin.site.register(Question)
admin.site.register(Answer)