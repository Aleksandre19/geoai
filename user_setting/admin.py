from django.contrib import admin
from user_setting.models import UserSetting

# Register your models here.
class SettingAdmin(admin.ModelAdmin):
    # prepopulated_fields = {"slug" : ("title",)}
    list_display = ("user", "light_mode", 'mode_style')

admin.site.register(UserSetting, SettingAdmin)
