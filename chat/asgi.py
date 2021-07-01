import os

from channels.routing import ProtocolTypeRouter,URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from django.conf.urls import url,re_path
from django.urls import path
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
from main.consumer import chat_fun,Audio,Youtube
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    # Just HTTP for now. (We can add other protocols later.)
    'websocket':AllowedHostsOriginValidator(
        URLRouter(
            [
                path(r'chat/', chat_fun.as_asgi()),
                path(r'room/',Audio.as_asgi()),
                path(r'rooms/<str:roomid>/',Youtube.as_asgi())

            ]
        )
    )
})