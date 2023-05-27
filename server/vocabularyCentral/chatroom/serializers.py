from rest_framework import serializers
from .models import group,chat

class groupSerializer(serializers.ModelSerializer):
    class Meta:
        model=group
        fields='__all__'
        
class chatSerializer(serializers.ModelSerializer):
    class Meta:
        model=chat
        fields='__all__'
