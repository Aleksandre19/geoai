# Generated by Django 4.2 on 2023-09-28 15:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0028_tokens_question_tokens'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='tokens',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='question', to='chat.tokens'),
        ),
    ]
