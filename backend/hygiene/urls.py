from django.urls import path
from . import views

urlpatterns = [
    path('reports/', views.reports_view, name='reports'),
    path('reports/<int:report_id>/delete/', views.delete_report, name='delete-report'),
    path('reports/<int:report_id>/resolve/', views.submit_resolution, name='resolve-report'),
    path('reports/<int:report_id>/approve/', views.approve_resolution, name='approve-resolution'),
    path('highrisk-zones/', views.high_risk_zones, name='high-risk-zones'),
    path('profile/', views.profile_data, name='profile-data'),
    path('leaderboard/', views.leaderboard_view, name='leaderboard'),  # ✅ NEW LINE
]
