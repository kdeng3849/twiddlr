import time
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

    def get_item(self):
        item = {}
        item['id'] = self.id
        item['username'] = self.username
        item['property'] = {}
        item['property']['likes'] = self.property_likes
        item['retweeted'] = self.retweeted
        item['content'] = self.content
        item['timestamp'] = self.timestamp

        return item