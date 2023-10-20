from django.contrib import admin
from user_setting.models import UserSetting, UserTokens

# Register your models here.
class SettingAdmin(admin.ModelAdmin):
    # prepopulated_fields = {"slug" : ("title",)}
    list_display = ("user", "light_mode", 'mode_style', 'chat_lang', 'interface_lang')

class UserTokensAdmin(admin.ModelAdmin):
    list_display = ("user", "value", "used", "token_id")

admin.site.register(UserSetting, SettingAdmin)
admin.site.register(UserTokens, UserTokensAdmin)
