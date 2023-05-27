from django.contrib import admin
from django.urls import path
from articles import views
app_name = 'articles'

urlpatterns = [
    path('article/get-all/', views.articleGetAll.as_view(), name="articleGetAll"),
    path('article/get/<int:pk>/', views.articleGet.as_view(), name="articleGet"),
    path('article/post/', views.articlePost.as_view(), name="articlePost"),
    path('article/delete/<int:pk>/', views.articleDelete.as_view(), name="articleDelete"),
    path('card/get/<int:pk>/', views.cardGet.as_view(), name="cardGetAlllang"),
    path('card/get/<int:pk>/<str:lang>/', views.cardGet.as_view(), name="cardGetSpecificLang"),
    path('card/post/<int:Aid>/', views.cardPost.as_view(), name="cardPost"),
    path('card/delete/<int:pk>/', views.cardDelete.as_view(), name="cardDelete"),
]