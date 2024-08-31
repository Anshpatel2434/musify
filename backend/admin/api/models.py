from django.db import models
from django.core.validators import MinLengthValidator
from django.contrib.auth.hashers import make_password, check_password as django_check_password


# Create your models here.
class User(models.Model):
    name=models.CharField(max_length=255)
    email=models.EmailField(unique=True,max_length=255)
    phone=models.CharField(max_length=10,validators=[MinLengthValidator(10)],null=True)
    password=models.CharField(max_length=20,validators=[MinLengthValidator(8)])
    created_at = models.DateTimeField(auto_now_add=True)
    birthdate=models.DateField(null=True)

    def __str__(self):
        return self.name +" : "+self.email
    
    def save(self, *args, **kwargs):
        if self.pk is None:
            self.password = make_password(self.password)
            # self.created_at = models.DateTimeField(auto_now_add=True)
        super().save(*args, **kwargs)
        
    def check_password(self, raw_password):
        return django_check_password(raw_password, self.password)
    
class Playlist(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class Song(models.Model):
    name = models.CharField(max_length=200)
    url = models.CharField(max_length=300)
    image = models.CharField(max_length=300)
    singer = models.CharField(max_length=300)
    artist = models.CharField(max_length=300)
    duration = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class PlaylistSong(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.playlist.name} - {self.song.name}"
    
    
class LikedSong(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    liked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'song')
        ordering = ['-liked_at']

    def __str__(self):
        return f"{self.user.name} liked {self.song.name}"
    
class History(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    played_at = models.DateTimeField(auto_now_add=True)
    play_count = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['-played_at']

    def __str__(self):
        return f"{self.user.name} played {self.song.name} on {self.played_at}"
    
