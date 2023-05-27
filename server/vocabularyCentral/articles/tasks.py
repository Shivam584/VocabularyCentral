from celery import shared_task
from django.core.mail import send_mail
from googletrans import Translator
from .models import *

@shared_task
def convert_task(text,lang,pk):
    obj=Card.objects.get(pk=pk)
    translator = Translator()
    transtext = translator.translate(text,dest=lang, src='en')
    transobj=Translated.objects.create(convertedText=transtext.text,pronouncedText=transtext.pronunciation,lang=lang,cardID=obj)
    transobj.generate_audio_file()
    return None
