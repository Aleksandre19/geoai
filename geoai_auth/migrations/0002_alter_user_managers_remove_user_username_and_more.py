# Generated by Django 4.2 on 2023-04-14 22:31

from django.db import migrations, models
import geoai_auth.models


class Migration(migrations.Migration):

    dependencies = [
        ('geoai_auth', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='user',
            managers=[
                ('objects', geoai_auth.models.GeoaiUserManager()),
            ],
        ),
        migrations.RemoveField(
            model_name='user',
            name='username',
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=254, unique=True, verbose_name='email address'),
        ),
    ]
