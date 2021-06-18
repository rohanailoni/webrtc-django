from django.shortcuts import render
from django.http import HttpResponse,HttpResponseRedirect

# Create your views here.
def main(request):
    return render(request,'main.html')

def index1(request):
    return render(request,'index.html')


def room1(request,room_name):


    return render(request,'room.html',{
        'room_name':room_name
    })