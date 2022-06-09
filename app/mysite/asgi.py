import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from django.conf.urls import url
from api.consumers import ApiConsumer

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")

application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "websocket": URLRouter([
            url(r"^ws/api/$", ApiConsumer.as_asgi()),
        ]),
})
