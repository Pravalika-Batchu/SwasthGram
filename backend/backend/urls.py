from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),  
    
    path('api/', include('hygiene.urls')),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
