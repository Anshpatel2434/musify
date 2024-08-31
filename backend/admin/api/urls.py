
from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('hello/', Hello.as_view(), name='hello'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('getotp/', GetOtpView.as_view(), name='getotp'),
    path('login/', LoginView.as_view(), name='login'),
    path('google-auth/', GoogleAuthView.as_view(), name='google_auth'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('getuserdata/', GetUserDataView.as_view(), name='getuserdata'),
    path('createplaylist/', CreatePlaylistView.as_view(), name='createplaylist'),
    path('renameplaylist/', RenamePlaylistView.as_view(), name='renameplaylist'),
    path('deleteplaylist/', DeletePlaylistView.as_view(), name='deleteplaylist'),
    path('addtoplaylist/', AddToPlaylistView.as_view(), name='addtoplaylist'),
    path('removefromplaylist/', RemoveFromPlaylistView.as_view(), name='removefromplaylist'),
]
