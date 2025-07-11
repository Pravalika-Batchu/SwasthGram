from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin

from django.shortcuts import redirect

def home_redirect(request):
    return redirect("https://swasthgram.netlify.app")



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),  
    path('api/', include('hygiene.urls')),
    path('', home_redirect),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)