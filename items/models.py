import time
from django.contrib.postgres.fields import ArrayField
from django.db import models

# Create your models here.
class Item(models.Model):
    id = models.CharField(primary_key=True, max_length=50)
    # content = models.FileField()
    username = models.CharField(max_length=25)
    property_likes = models.IntegerField(default=0)
    retweeted = models.IntegerField(default=0)
    content = models.CharField(max_length=280)
    timestamp = models.FloatField(default=time.time)
    childtype = models.CharField(max_length=25, null=True)
    parent = models.CharField(max_length=50, blank=True, null=True)
    media = ArrayField(models.CharField(max_length=50), default=list)

    def get_item(self):
        item = {}
        item['id'] = self.id
        item['username'] = self.username
        item['property'] = {}
        item['property']['likes'] = self.property_likes
        item['retweeted'] = self.retweeted
        item['content'] = self.content
        item['timestamp'] = self.timestamp
        item['childType'] = self.childtype
        item['parent'] = self.parent
        item['media'] = self.media

        return item