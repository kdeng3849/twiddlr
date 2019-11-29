import cassandra.cluster
import base64
import time
import json
import uuid

from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from users.models import Profile
from .models import Item

# cluster = cassandra.cluster.Cluster(['130.245.169.94'])
# session = cluster.connect()
# session.set_keyspace('twiddlr')

def home(request):
    context = {
        'items': []
    }

    query = list(Item.objects.filter(timestamp__lte=time.time()).order_by('-timestamp')[:10])
    for item in query:
        context['items'].append(item.get_item())

    # print(request.COOKIES)
    return render(request, 'items/home.html', context)

@csrf_exempt
def add_media(request):
    response = {
        'status': 'OK',
        'id': '',
    }
    # print(json.loads(request.body, encoding='utf-8'))
    print(request.FILES)
    media = request.FILES['media']

    # print(media.read())
    if media:
        # cluster = cassandra.cluster.Cluster(['130.245.169.94'])
        cluster = cassandra.cluster.Cluster(['127.0.0.1'])
        session = cluster.connect()
        session.set_keyspace('twiddlr')

        media_id = str(uuid.uuid4().node)
        session.execute("INSERT INTO media (id, file_contents) VALUES (%s, %s)", [media_id, media.read()])
        cluster.shutdown()

        response['id'] = media_id

    return JsonResponse(response)

@csrf_exempt
def add_item(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error'})

    data = json.loads(request.body, encoding='utf-8')

    try:
        username = request.user.username
        content = data['content']
        # child_type = data['childType']
    except KeyError:
        context = {
            'status': 'error',
            'error': "POST body must include properties 'content', 'parent', and 'media' in the form of JSON",
        }
        return JsonResponse(context)

    item = Item(id=uuid.uuid4().node, username=username, content=content)
    # item.id = uuid.uuid4().node
    # item.username = username
    # # item.property = ItemProperty()
    # item.content = content
    item.save()
    # print(type(item.id))

    context = {
        'status': 'OK',
        'id': str(item.id),
        # 'timestamp': item.timestamp,
    }
    return JsonResponse(context)

@csrf_exempt
def get_item(request, item_id):
    try:
        item = Item.objects.get(id=item_id)
        # query = list(Item.objects.filter(id=item_id).values('id', 'username', 'property', 'retweeted', 'content', 'timestamp'))
    except Item.DoesNotExist:
        context = {
            'status': 'error',
            'error': 'Item not found',
        }
        return JsonResponse(context, status=404)

    if request.method == 'DELETE':
        if not request.user.is_authenticated or not item.username == request.user.username:
            response = {
                'status': 'error',
                'error': 'You do not have permission to perform this action'
            }
            return JsonResponse(response, status=403)

        # user is logged in and is the author of the post
        item.delete()
        return HttpResponse(status=200)

    # method is not DELETE
    item = item.get_item()
    context = {
        'status': 'OK',
        'item': item,
    }

    return JsonResponse(context)

@csrf_exempt
def search(request):
    data = json.loads(request.body, encoding='utf-8') if request.body else {}
    timestamp = data.get('timestamp') or time.time()
    limit = data.get('limit') or 25
    q = data.get('q')
    username = data.get('username')
    following = data.get('following')

    print(data)
    print(request.user.username)

    limit = limit if limit in range(201) else 200

    response = {
        'status': 'OK',
        'items': [],
    }

    try:
        query = Item.objects.filter(timestamp__lte=timestamp).order_by('-timestamp')
    except ValueError:
        query = Item.objects.filter(timestamp__lte=time.time()).order_by('-timestamp')

    if q:
        keywords_query = Item.objects.none()
        keywords = q.split()
        for keyword in keywords:
            keywords_query |= Item.objects.filter(content__icontains=keyword)
        query &= keywords_query

    if username:
        username_query = Item.objects.filter(username=username)
        query &= username_query

    if following and request.user.is_authenticated:
        profile = Profile.objects.get(user__username=request.user.username)
        following_query = Item.objects.filter(username__in=profile.get_following())
        query &= following_query

    # query = timestamp_query & username_query & following_query
    # query = timestamp_query
    query = list(query[:limit])
    for item in query:
        response['items'].append(item.get_item())

    return JsonResponse(response)

@csrf_exempt
@require_http_methods(["POST"])
def like(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error'})

    data = json.loads(request.body, encoding='utf-8')
    print(data)
    item_id = data['id']

    try:
        item = Item.objects.get(id=item_id)
        item.property_likes += 1
        item.save()
    except Item.DoesNotExist:
        return JsonResponse({'status': 'error'})

    response = {
        'status': 'OK',
        'likes': item.property_likes,
    }
    return JsonResponse(response)
