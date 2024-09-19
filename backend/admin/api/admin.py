from django.contrib import admin
from .models import *

# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'created_at','birthdate','profilePic') 
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
    
@admin.register(LikedSong)
class  LikedSongAdmin(admin.ModelAdmin):
    list_display = ('user', 'song', 'liked_at')
    readonly_fields = ('liked_at',)
    
@admin.register(History)
class  HistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'song', 'played_at','play_count')
    readonly_fields = ('played_at',)



