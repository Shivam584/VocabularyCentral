from django.contrib import admin
from .models import *
# Register your models here.
@admin.register(group)
class groupAdmin(admin.ModelAdmin):
    list_display=['id','groupname']
@admin.register(chat)
class groupAdmin(admin.ModelAdmin):
    list_display=['id','content','group','user','timestamp']