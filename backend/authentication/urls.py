from django.urls import path
from .views import register_user,login_user
<<<<<<< HEAD
=======

>>>>>>> f27c4f3 (updated backend files)

urlpatterns = [
    path('login/', login_user),
    path('register/', register_user, name='register_user'),
]
