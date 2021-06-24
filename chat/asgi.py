import os

from channels.routing import ProtocolTypeRouter,URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from django.conf.urls import url,re_path
from django.urls import path
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
from main.consumer import chat_fun,Audio
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    # Just HTTP for now. (We can add other protocols later.)
    'websocket':AuthMiddlewareStack(
        URLRouter(
            [
                path(r'chat/', chat_fun.as_asgi()),
                path(r'audio/',Audio),

            ]
        )
    )
})