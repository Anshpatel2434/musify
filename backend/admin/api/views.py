from rest_framework.views import APIView 
from rest_framework.response import Response 
from rest_framework.permissions import AllowAny  
from rest_framework import generics, status, permissions
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *
import requests
from .models import *
from django.contrib.auth.hashers import check_password
from django.db import models
from .sendmail import sendMail
import random
from django.utils import timezone  
from datetime import timedelta  
import jwt  
from django.conf import settings 
# from django.contrib.auth import get_user_model
# from rest_framework.decorators import api_view
# from social_core.backends.google import GoogleOAuth2
# from social_django.utils import load_strategy,load_backend
# from social_core.exceptions import AuthException, AuthTokenError, AuthForbidden
# from rest_framework.authtoken.models import Token

class Hello(APIView):
    def get(self, request, format=None):
        return Response({
            'message': 'Hello, World!',
        })
        
def create_jwt(user):
    payload = {
        'email': user['email'],
        'exp': timezone.now() + timedelta(hours=1),
        'iat': timezone.now()
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token

class GoogleAuthView(APIView):
    def post(self, request):
        try:
            token = request.data.get('token')
            if not token:
                return JsonResponse({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Verify the token with Google's API
            response = requests.get(f'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={token}')
            user_info = response.json()
            
            if response.status_code != 200:
                return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Extract user info
            email = user_info.get('email')
            name = user_info.get('name')
            
            if not email:
                return Response({'error': 'Email is missing from token'}, status=status.HTTP_400_BAD_REQUEST)
            
            jwt_token=create_jwt(user_info)
            
            user, created = User.objects.get_or_create(email=email, defaults={'name': name})
            user.save()

            return Response({
                    'status':200,
                    'jwt':jwt_token,
                    'name': user.name,
                    'email': user.email
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetOtpView(APIView):
    permission_classes=[AllowAny]
    otp=0
    def post(self,request):
        email = request.data.get('email')
        code=random.randint(1000, 9999)
        GetOtpView.otp=code
        try:
            sendMail(email=email,code=code)
            SignupView.otp=code
            return Response({
                'status':200,
                'message':'Otp sent Successfully to '+email
            }, status=status.HTTP_200_OK)
        except:
            return Response({
                'status':400,
                'message':'Some Error Occured While Sending OTP'
            }, status=status.HTTP_400_BAD_REQUEST)

class SignupView(APIView):
    permission_classes = [AllowAny]
    otp=int(GetOtpView.otp)
    def post(self, request, format=None):
        errMsg=''
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = User.objects.create(
                    name=serializer.validated_data['name'],
                    email=serializer.validated_data['email'],
                    phone=serializer.validated_data['phone'],
                    password=serializer.validated_data['password'],
                )
                user.save()
                jwt_token = create_jwt(user)
                
                return Response({
                    'status': 200,
                    'jwt': jwt_token,
                    'message': 'Account created successfully!'
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    'status': 500,
                    'message': 'Some error occurred while creating the account',
                    'error': str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            errors = serializer.errors
            key = next(iter(errors.keys()), 'Unknown')
            errMsg = next(iter(errors.values()), 'Unknown error')
            return Response({
                'status': 400,
                'message': key.capitalize()+" : "+errMsg[0]
            }, status=status.HTTP_400_BAD_REQUEST)
         
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self,request):
        cred=request.data.get('cred')
        email,phone='',''
        if '@' in cred :
            email=cred
        else:
            phone=cred
            
        serializer = UserLoginSerializer(data={'email':email,'phone':phone,'password':request.data.get('password')})
        
        if serializer.is_valid():
            try:
                if email:     
                    user=User.objects.get(email=serializer.validated_data['email'])
                else:
                    user=User.objects.get(phone=serializer.validated_data['phone'])

                if user:
                    if not user.check_password(serializer.validated_data.get('password')):
                        return Response({
                            'status': 401,
                            'message': 'Invalid password'
                        },status=status.HTTP_406_NOT_ACCEPTABLE)
                    else:
                        jwt=create_jwt({'email':email})
                        return Response({
                            'status': 200,
                            'jwt':jwt,
                            'message': 'Login Successfull',
                            'user':{
                                'email':user.email,
                                'name':user.name
                            }
                        },status=status.HTTP_202_ACCEPTED)
                else:
                    return Response({
                            'status': 401,
                            'message': 'Invalid Email or phone number'
                        },status=status.HTTP_406_NOT_ACCEPTABLE)
            except Exception as e :
                print(e)
                return Response({
                            'status': 500,
                            'message': 'Error occured while fetching user'
                        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            errors = serializer.errors
            key = next(iter(errors.keys()), 'Unknown')
            errMsg = next(iter(errors.values()), 'Unknown error')
            return Response({
                'status': 400,
                'message': key.capitalize()+" : "+errMsg[0]
            }, status=status.HTTP_400_BAD_REQUEST)
                
class GetUserDataView(APIView):
    permission_classes = [AllowAny]

    def get_playlists(self, user):
        playlists = Playlist.objects.filter(user=user).prefetch_related('playlistsong_set__song')
        serializer = PlaylistSerializer(playlists, many=True)
        result = {
        playlist['name']: [playlist_song['song'] for playlist_song in playlist['playlistsong_set']]
        for playlist in serializer.data
        }        
        return result

    def get_likedsongs(self, user):
        liked_songs = LikedSong.objects.filter(user=user).select_related('song')
        serializer = LikedSongSerializer(liked_songs, many=True)
        return serializer.data

    def get_history(self, user):
        history_records = History.objects.filter(user=user).select_related('song')
        serializer = HistorySerializer(history_records, many=True)
        return serializer.data

    def get_profile(self, user):
        serializer = UserSerializer(user)
        return serializer.data

    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({
                'status': 200,
                "error": "User not found"
            })

        try:
            playlist = self.get_playlists(user)
            likedsongs = self.get_likedsongs(user)
            history = self.get_history(user)
            profile = self.get_profile(user)

            print(playlist)
            print(likedsongs)
            print(history)
            print(profile)

            return Response({
                'status': 200,
                'playlist': playlist,
                'likedsongs': likedsongs,
                'history': history,
                'profile': profile,
            })
        except Exception as e:
            print("error while fetching")
            print(e)
            return Response({
                'status': 400,
                'message': 'Some error occurred while fetching User Details'
            })
        
class CreatePlaylistView(APIView):
    permission_classes = [AllowAny]
    
    def post(self,request):
        email = request.data.get('email')
        name = request.data.get('name')
        
        try:
            user = User.objects.get(email=email)
            playlist = Playlist.objects.create(user=user,name=name)
            print("playlist created")
            print(playlist)
            playlist.save()
            return Response({
                'status':200,
                'message':"Playlist created successfully"
            })
        except:
            return Response({
            'status':400,
            "error": "Error occured while creating playlist"
            })
            
class RenamePlaylistView(APIView):
    permission_classes = [AllowAny]
    
    def post(self,request):
        email = request.data.get('email')
        oldName=request.data.get('oldName')
        newName=request.data.get('newName')
        
        try:
            user = User.objects.get(email=email)
            playlist=Playlist.objects.get(user=user,name=oldName)
            playlist.name=newName
            playlist.save()

            return Response({
                    'status':200,
                    'message':"Playlist renamed successfully"
                })
        except:
            return Response({
                'status':400,
                "error": "Error occured while renaming playlist"
                })
            
class DeletePlaylistView(APIView):
    permission_classes = [AllowAny]
    
    def post(self,request):
        email = request.data.get('email')
        name=request.data.get('name')

        try:
            user = User.objects.get(email=email)
            playlist=Playlist.objects.get(user=user,name=name)
            playlist.delete()
            print("delete playlist")
            print(playlist)
            return Response({
                    'status':200,
                    'message':"Playlist deleted successfully"
                })
        except:
            return Response({
                'status':400,
                "error": "Error occured while deleting playlist"
                })
            
class AddToPlaylistView(APIView):
    permission_classes = [AllowAny]
    
    def post(self,request):
        email = request.data.get('email')
        songData = request.data.get('song')
        playlistName=request.data.get('playlistName')
        
        try:
            user=User.objects.get(email=email)
            playlist=Playlist.objects.get(user=user,name=playlistName)
            song,created = Song.objects.get_or_create(
                name=songData['name'],
                    url=songData['url'],
                    image=songData['image'],
                    singer=songData['singer'],
                    duration=songData['duration'],
                    artist=songData['artist'],
                )
            
            playlist_song=PlaylistSong.objects.create(playlist=playlist,song=song)
            
            return Response({
                'status':200,
                'message':"Song added to playlist"
            })
        except Exception as e:
            print(e)
            return Response({
                'status':404,
                'message':"Error while adding song to playlist"
            })
            
class RemoveFromPlaylistView(APIView):
    permission_classes = [AllowAny]
    
    def post(self,request):
        email = request.data.get('email')
        songData = request.data.get('song')
        playlistName=request.data.get('playlistName')
        
        try:
            user=User.objects.get(email=email)
            playlist=Playlist.objects.get(user=user,name=playlistName)
            song= Song.objects.get(
                name=songData['name'],
                    url=songData['url'],
                    image=songData['image'],
                    singer=songData['singer'],
                    duration=songData['duration'],
                    artist=songData['artist'],
                )
            
            playlist_song=PlaylistSong.objects.get(playlist=playlist,song=song)
            playlist_song.delete()
            
            return Response({
                'status':200,
                'message':"Song deleted from playlist"
            })
        except Exception as e:
            print(e)
            return Response({
                'status':404,
                'message':"Error while deleting the Song from playlist"
            })