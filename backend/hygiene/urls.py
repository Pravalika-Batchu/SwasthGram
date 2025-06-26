# hygiene/urls.py

from django.urls import path
from .views import reports_view  
from .views import high_risk_zones
urlpatterns = [
    path('reports/', reports_view, name='reports'),
    path('highrisk-zones/', high_risk_zones), 
    
]
