from articles.serializers import *
from articles.models import *
from articles.tasks import *
from articles.renders import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,IsAdminUser

class articleGetAll(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    def get(self,request):
        articleobj=Article.objects.all()
        serializerd=ArticleSerializer(articleobj,many=True)
        return Response(serializerd.data,status=status.HTTP_200_OK)

class articleGet(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    def get(self,request,pk):
        articleobj=Article()
        try:
            articleobj=Article.objects.get(pk=pk)
            serializerd=ArticleSerializer(articleobj)
            py_data=serializerd.data
            cardobj = Card.objects.filter(ArticleID=pk)
            serializerd=CardSerializer(cardobj,many=True)
            py_data['cards']=serializerd.data
            return Response(py_data,status=status.HTTP_200_OK)
        except articleobj.DoesNotExist:
            json_data={'msg': 'not found'}
            return Response({"errors": json_data},status=status.HTTP_404_NOT_FOUND)

class articlePost(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    def post(self,request):
        languages = ['hi', 'te', 'bn']
        parsed_data=request.data
        cards_data = parsed_data.pop('cards')
        serializerd=ArticleSerializer(data=parsed_data)
        if serializerd.is_valid():
            serializerd.save()
            for card in cards_data:
                card['ArticleID']=serializerd.data['id']
            serializerd=CardSerializer(data=cards_data,many=True)
            if serializerd.is_valid():
                serializerd.save()
                for card in serializerd.data:
                    for lang in languages:
                        convert_task.delay(card['cardValue'],lang,card['id'])
                data={'msg':'Data saved!'}
                return Response(data,status=status.HTTP_200_OK)
            else:
                json_data={ "msg" : serializerd.errors} 
                return Response(json_data,status=status.HTTP_400_BAD_REQUEST)
        else:
            json_data={ "msg" : serializerd.errors} 
            return Response(json_data,status=status.HTTP_400_BAD_REQUEST)

class articleDelete(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated,IsAdminUser]
    def delete(self,request,pk):
        try:
            articleobj=Article.objects.get(pk=pk)
            articleobj.delete()
            json_data={ "msg" : "data deleted" }
            return Response(json_data,status=status.HTTP_200_OK)
        except Article.DoesNotExist:
            json_data={'msg': 'file not found'}
            return Response({"errors": json_data}, status=status.HTTP_404_NOT_FOUND)

class cardGet(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    def get(self,request,pk=None,lang=None):
        cardobj = Card()
        transobj=Translated()
        try:
            cardobj=Card.objects.get(pk=pk)
            serializerd=CardSerializer(cardobj)
            py_data=serializerd.data
            if lang is None:
                transobj=Translated.objects.filter(cardID=py_data['id'])
            else:
                transobj=Translated.objects.filter(cardID=py_data['id'],lang=lang)
            serializerd= TranslatedSerializer(transobj,many=True)
            py_data['trans']=serializerd.data
            return Response(py_data,status=status.HTTP_200_OK)
        except cardobj.DoesNotExist:
            json_data={'card': 'not found'}
            return Response({"errors" : json_data },status=status.HTTP_400_BAD_REQUEST)

class cardPost(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    def post(self,request,Aid):
        parsed_data=request.data
        languages = ['hi', 'te', 'bn']
        try:
            articobj=Article.objects.get(pk=Aid)
            for card in parsed_data.get('cards'):
                cardobj=Card.objects.create(cardValue=card['cardValue'],ArticleID=articobj)
                for lang in languages:
                    convert_task.delay(cardobj.cardValue,lang,cardobj.id)
            json_data={"msg" : "Article updated"}
            return Response(json_data,status=status.HTTP_200_OK)
        except Article.DoesNotExist:
            json_data={"msg" : "Article not found"}
            return Response(json_data,status=status.HTTP_400_BAD_REQUEST)


class cardDelete(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated,IsAdminUser]
    def delete(self,request,pk):
        try:
            Cardobj=Card.objects.get(pk=pk)
            Cardobj.delete()
            json_data={ "msg" : "data deleted" }
            return Response(json_data,status=status.HTTP_200_OK)
        except Card.DoesNotExist:
            json_data={'msg': 'file not found'}
            return Response(json_data,status=status.HTTP_400_BAD_REQUEST)

# to post article
# {
#     "ArticleName": "greetings",
#     "description": "This article teach how to greet a person in mutliple languages",
#     "cards": [
#         { 
#             "cardValue":"Hello! my name is shivam"
#         },
#         { 
#             "cardValue": "Hi! Shivam my name is Sobhan"
#         },
#         { 
#             "cardValue": "Nice to meet you Sobhan"
#         }
#     ]
# }

# to get in article
# if no id is given the, all Article will be shown 
# [
# {
#     "id":92,
#     "ArticleName":"greetings",
#     "description":"This article teach how to greet a person in mutliple languages"
# },
# {
#     "id":93,
#     "ArticleName":"greetings",
#     "description":"This article teach how to greet a person in mutliple languages"
# },
# {
#     "id":94,
#     "ArticleName":"greetings",
#     "description":"This article teach how to greet a person in mutliple languages"
# }
# ]


# if id is given to get
# {
#     "id" : "88"
# }

# {
#     "id": 92,
#     "ArticleName": "greetings",
#     "description": "This article teach how to greet a person in mutliple languages",
#     "cards": [
#         {
#             "id": 176,
#             "cardValue": "Hello! my name is shivam",
#             "ArticleID": 92
#         },
#         {
#             "id": 177,
#             "cardValue": "Hi! Shivam my name is Sobhan",
#             "ArticleID": 92
#         },
#         {
#             "id": 178,
#             "cardValue": "Nice to meet you Sobhan",
#             "ArticleID": 92
#         }
#     ]
# }


# in card API
# to get a card detail
# IF INPUT is json
# {
#     "id": "170",
#     "lang" : "hi"
# }
# output Json
# {
#     "id": 176,
#     "cardValue": "Hello! my name is shivam",
#     "ArticleID": 92,
#     "trans": [
#         {
#             "id": 163,
#             "convertedText": "नमस्ते!मेरा नाम शिवम हे",
#             "pronouncedText": "namaste! mera naam shivam he",
#             "lang": "hi",
#             "audio_link": "https://drive.google.com/uc?id=10PfHJFqds4HfQ_FwFrARJzxquy7xiNMI&export=download",
#             "cardID": 176
#         }
#     ]
# }

# if lang is not given 
# input
# {
#     "id": "176"
# }
# output
# {
#     "id": 176,
#     "cardValue": "Hello! my name is shivam",
#     "ArticleID": 92,
#     "trans": [
#         {
#             "id": 163,
#             "convertedText": "नमस्ते!मेरा नाम शिवम हे",
#             "pronouncedText": "namaste! mera naam shivam he",
#             "lang": "hi",
#             "audio_link": "https://drive.google.com/uc?id=10PfHJFqds4HfQ_FwFrARJzxquy7xiNMI&export=download",
#             "cardID": 176
#         },
#         {
#             "id": 164,
#             "convertedText": "హలో!నా పేరు శివామ్",
#             "pronouncedText": "Halō! Nā pēru śivām",
#             "lang": "te",
#             "audio_link": "https://drive.google.com/uc?id=1sujU1CMWde5P1Lah2mPUjQMcYcl60Lz5&export=download",
#             "cardID": 176
#         },
#         {
#             "id": 165,
#             "convertedText": "হ্যালো!আমার নাম শিবম",
#             "pronouncedText": "Hyālō! Āmāra nāma śibama",
#             "lang": "bn",
#             "audio_link": "https://drive.google.com/uc?id=10gVrTj6mowB4IGdJyUTnmHKgnebkMGny&export=download",
#             "cardID": 176
#         }
#     ]
# }

# for post 
# INPUT
# {
#     "id": "92",
#     "cards": [
#         {
#             "id": 176,
#             "cardValue": "Hello! my name is shivam"
#         },
#         {
#             "id": 177,
#             "cardValue": "Hi! Shivam my name is Sobhan"
#         },
#         {
#             "id": 178,
#             "cardValue": "Nice to meet you Sobhan"
#         }
#     ]
# }