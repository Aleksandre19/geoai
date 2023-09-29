from django.apps import AppConfig


class UserSettingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'user_setting'

    def ready(self):
        import user_setting.signals