from chatroom.serializers import *
from chatroom.models import *
from chatroom.tasks import *
from chatroom.renders import *
from rest_framework.views import APIView
from rest_framework.response import Response
from google.transliteration import transliterate_text
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,IsAdminUser

class chatroomGetChat(APIView):
    renderer_classes=[UserRenderer]
    # permission_classes=[IsAuthenticated]
    def get(self,request,groupname,lang):
            try:
                groupobj=group.objects.get(groupname=groupname)
                chatobjs=chat()
                parsed_data = request.data
                last_chat_id=parsed_data['last_chat_id']
                print('print last id.........',last_chat_id)
                if last_chat_id is None:
                    chatobjs = chat.objects.filter(group=groupobj)
                else:
                    chatobjs=chat.objects.filter(group=groupobj,id__gt=last_chat_id)
                serialized=chatSerializer(chatobjs,many=True)
                data=serialized.data
                for each in data:
                    each['content']=transliterate_text(each['content'], lang_code=lang)
                return Response(data,status=status.HTTP_200_OK)
            except group.DoesNotExist:
                return Response({'errors': 'group name not found'},status=status.HTTP_400_BAD_REQUEST)
            

        
class chatroomPostChat(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    def post(self,request):
        parsed_data=request.data
        serializerd=chatSerializer(data=parsed_data)
        if serializerd.is_valid():
            serializerd.save()
            return Response("{'msg': 'new chat is added'}",status=status.HTTP_200_OK)

        return Response(serializerd.errors,status=status.HTTP_400_BAD_REQUEST)


class chatroomJoinGroup(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    def post(self,request):
        parsed_data=request.data
        serializerd=groupSerializer(data=parsed_data)
        if serializerd.is_valid():
            serializerd.save()
            return Response("{'msg': 'new group is Joined'}",status=status.HTTP_200_OK)

        return Response("{'msg': 'group is Joined'}",status=status.HTTP_200_OK)


class chatroomGetGroupList(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    def get(self,request):
        list_of_groups=group.objects.all()
        list_of_groups=groupSerializer(list_of_groups,many=True)
        group_data={
            'groups':[]
        }
        for eachgrp in list_of_groups.data:
            group_data['groups'].append(eachgrp['groupname'])
        return Response(group_data,status=status.HTTP_200_OK)

