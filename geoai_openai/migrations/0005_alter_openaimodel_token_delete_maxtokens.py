# Generated by Django 4.2 on 2023-11-01 13:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('geoai_openai', '0004_maxtokens_remove_parameters_max_tokens_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='openaimodel',
            name='token',
            field=models.IntegerField(default=4097),
        ),
        migrations.DeleteModel(
            name='MaxTokens',
        ),
    ]
