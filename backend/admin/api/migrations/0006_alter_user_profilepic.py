# Generated by Django 5.1 on 2024-09-02 21:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_user_profilepic'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='profilePic',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
    ]
