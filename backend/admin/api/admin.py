from django.contrib import admin
from .models import *

# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'created_at') 
    readonly_fields = ('created_at',) 
    
@admin.register(Playlist)
class PlaylistAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'created_at') 
    readonly_fields = ('created_at',) 
    
@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ('name', 'url', 'image','singer','artist','duration') 
    
@admin.register(PlaylistSong)
class PlaylistSongAdmin(admin.ModelAdmin):
    list_display = ('playlist', 'song', 'added_at') 
    readonly_fields = ('added_at',) 


