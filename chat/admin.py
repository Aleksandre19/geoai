from django.contrib import admin
from chat.models import Subject, Question, Answer

# Register your models here.
class SubjectAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug" : ("title",)}
    list_display = ("slug", "created_at")

admin.site.register(Subject, SubjectAdmin)
admin.site.register(Question)
admin.site.register(Answer)