from django.contrib import admin
from .models import *
# Register your models here.

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display=['id','ArticleName','description']

@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ['id', 'cardValue', 'ArticleID']

@admin.register(Translated)
class TranslatedAdmin(admin.ModelAdmin):
    list_display=['id','convertedText','pronouncedText','lang','audio_link','cardID']
