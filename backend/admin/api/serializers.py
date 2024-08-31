from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name','email','phone', 'password','birthdate']
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 8},
        }

    def validate(self, data):
        from .views import GetOtpView # keep this import inside this validate func. only , else it will give circular import error
        
        if not data['name'] or not data['email'] or not data['password'] or not data['otp']:
            raise serializers.ValidationError({"name": "Fields marked with * must not be empty"})
        if int(data['otp']) != GetOtpView.otp:
            raise serializers.ValidationError({"otp": "Invalid OTP"})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Email is already in use."})
        return data
    
class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)   
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email','phone','password']
        
        
class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ['id', 'name', 'url', 'image', 'singer', 'artist', 'duration']
        
class PlaylistSongSerializer(serializers.ModelSerializer):
    song = SongSerializer(read_only=True)  

    class Meta:
        model = PlaylistSong
        fields = ['id', 'song', 'added_at']  
        
class PlaylistSerializer(serializers.ModelSerializer):
    playlistsong_set = PlaylistSongSerializer(many=True, read_only=True)

    class Meta:
        model = Playlist
        fields = ['id', 'name', 'created_at', 'playlistsong_set']

    
class LikedSongSerializer(serializers.ModelSerializer):
    song = SongSerializer(read_only=True)
    
    class Meta:
        model = LikedSong
        fields = ['id', 'song', 'liked_at']
        
class HistorySerializer(serializers.ModelSerializer):
    song = SongSerializer(read_only=True)  # Nest the SongSerializer to include song details

    class Meta:
        model = History
        fields = ['id', 'song', 'played_at', 'play_count']
        
