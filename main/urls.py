from django.urls import path

from . import views

urlpatterns = [
    path('',views.main),
    path('<str:room_name>/', views.room1, name='room'),

]