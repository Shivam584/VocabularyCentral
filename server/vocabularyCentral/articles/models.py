from django.db import models
from gdstorage.storage import GoogleDriveStorage
from gtts import gTTS
from django.core.files.base import ContentFile
from io import BytesIO
gd_storage = GoogleDriveStorage()

class Article(models.Model):
    ArticleName=models.CharField(max_length=200,blank=False)
    description=models.CharField(max_length=500,blank=False)

class Card(models.Model):
    cardValue=models.CharField(max_length=200,blank=False)
    ArticleID=models.ForeignKey(Article,null=False,related_name='cards',on_delete=models.CASCADE)


class Translated(models.Model):
    convertedText=models.CharField(max_length=300,blank=False)
    pronouncedText=models.CharField(max_length=300)
    lang=models.CharField(max_length=40,blank=False)
    audio_link = models.FileField(upload_to='audio-dump/' ,storage=gd_storage, blank=True,null=True)
    cardID=models.ForeignKey(Card,null=False,related_name='trans', on_delete=models.CASCADE)


    def generate_audio_file(self):
        audio_bytes = BytesIO()
        tts = gTTS(text=self.convertedText, lang=self.lang,slow=False, lang_check=False)
        tts.write_to_fp(audio_bytes)        
        audio_bytes.seek(0)
        file_name = f"{self.convertedText+self.lang}.mp3"
        self.audio_link.save(file_name, ContentFile(audio_bytes.read()))