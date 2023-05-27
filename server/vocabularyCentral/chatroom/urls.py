from django.contrib import admin
from django.urls import path
from chatroom import views
app_name = 'chatroom'

urlpatterns = [

    # path('article/get-all/', views.articleGetAll.as_view(), name="articleGetAll"),
    path('get/<str:groupname>/<str:lang>/', views.chatroomGetChat.as_view(), name="chatroomGetChat"),
    path('post/', views.chatroomPostChat.as_view(), name="chatroomPostChat"),
    path('join/', views.chatroomJoinGroup.as_view(), name="chatroomJoinGroup"),
    path('group/list/', views.chatroomGetGroupList.as_view(), name="chatroomGetGroupList"),
  
]