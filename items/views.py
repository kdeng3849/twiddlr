import time
import json
import uuid

from django.core import serializers
from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# from .models import Item, ItemProperty
# from .serializers import ItemSerializer
# from .utils import to_dict

def home(request):

    context = {
        'items': []
    }
    # query = list(Item.objects.filter(timestamp__lte=time.time()).order_by('-timestamp')[:10])
    # for item in query:
    #     context['items'].append(to_dict(item))

    return render(request, 'items/home.html', context)
