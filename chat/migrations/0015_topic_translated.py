# Generated by Django 4.2 on 2023-05-10 14:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0014_answer_translated_question_translated'),
    ]

    operations = [
        migrations.AddField(
            model_name='topic',
            name='translated',
            field=models.CharField(blank=True, default=None, max_length=255, null=True),
        ),
    ]
