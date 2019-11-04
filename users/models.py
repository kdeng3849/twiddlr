import time
from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    followers = models.TextField(default='')
    following = models.TextField(default='')

    def get_followers(self):
        return self.followers.split()
        
    def get_following(self):
        return self.following.split()

    def add_follower(self, username):
        self.followers += " " + username

    def add_following(self, username):
        self.following += " " + username

    def remove_follower(self, username):
        followers = self.get_followers()

        if username in followers:
            followers.remove(username)
            self.followers = ' '.join(followers)

    def remove_following(self, username):
        following = self.get_following()

        if username in following:
            following.remove(username)
            self.following = ' '.join(following)

    def count_followers(self):
        return len(self.get_followers())

    def count_following(self):
        return len(self.get_following())
