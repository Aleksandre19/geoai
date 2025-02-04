# Generated by Django 4.2 on 2023-06-05 21:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0017_alter_topic_options'),
    ]

    operations = [
        migrations.RenameField(
            model_name='answer',
            old_name='translated',
            new_name='eng_content',
        ),
        migrations.RenameField(
            model_name='answer',
            old_name='content',
            new_name='geo_unformated_content',
        ),
        migrations.AddField(
            model_name='answer',
            name='geo_formated_content',
            field=models.TextField(default=''),
        ),
    ]
