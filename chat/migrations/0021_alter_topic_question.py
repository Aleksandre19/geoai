# Generated by Django 4.2 on 2023-07-06 14:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0020_alter_topic_question'),
    ]

    operations = [
        migrations.AlterField(
            model_name='topic',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='topic', to='chat.question'),
        ),
    ]
