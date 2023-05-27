from rest_framework import serializers
from .models import Card,Article,Translated



class TranslatedSerializer(serializers.ModelSerializer):
    class Meta:
        model=Translated
        fields='__all__'

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = '__all__'
        extra_kwargs = {
            'trans': {'required': False}
        }

        def create(self, validated_data):
            return Card.objects.create(**validated_data)

class ArticleSerializer(serializers.ModelSerializer):
    # cards = CardSerializer(many=True) 
    class Meta:
        model = Article
        fields = '__all__'
        # extra_kwargs = {
        #     'cards': {'required': False}
        # }

    def create(self, validated_data):
        # card_data = validated_data.pop('cards')
        article = Article.objects.create(**validated_data)
        # for card in card_data:
        #     Card.objects.create(Article=article, **card)
        return article
    
    

    
    
    
