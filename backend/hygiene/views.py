from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import HygieneReport, UserProfile
from .serializers import HygieneReportSerializer
from datetime import datetime
from geopy.distance import geodesic
from django.contrib.auth.models import User

# Profile endpoint ✅
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_data(request):
    user = request.user
    reports = HygieneReport.objects.filter(user=user)
    solved = HygieneReport.objects.filter(resolved_by=user, is_approved=True)

    count = reports.count()
    solved_count = solved.count()

    badges = []
    if count >= 1:
        badges.append("📝 First Report Submitted")
    if solved_count >= 1:
        badges.append("⭐ First Task Completed")
    if solved_count >= 5:
        badges.append("🛠️ 5 Issues Solved")
    if solved_count >= 10:
        badges.append("💪 Hygiene Hero")

    return Response({
        'username': user.username,
        'report_count': count,
        'points': solved_count * 10,
        'badges': badges
    })


# Reports View (GET & POST)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def reports_view(request):
    if request.method == 'GET':
        reports = HygieneReport.objects.all()
        serializer = HygieneReportSerializer(reports, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = HygieneReportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


# High Risk Zones (open endpoint)
@api_view(['GET'])
@permission_classes([AllowAny])
def high_risk_zones(request):
    def is_rainy_season():
        month = datetime.now().month
        return 6 <= month <= 9  # June to September

    if not is_rainy_season():
        return Response([])

    stagnant_reports = HygieneReport.objects.filter(issue_type='stagnant_water')
    stagnant_coords = [(r.latitude, r.longitude) for r in stagnant_reports]

    high_risk_clusters = []
    for i, coord1 in enumerate(stagnant_coords):
        count = 1
        for j, coord2 in enumerate(stagnant_coords):
            if i != j and geodesic(coord1, coord2).km <= 5.0:
                count += 1
        if count >= 2 and coord1 not in high_risk_clusters:
            high_risk_clusters.append(coord1)

    return Response(high_risk_clusters)


# Delete Report
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_report(request, report_id):
    try:
        report = HygieneReport.objects.get(id=report_id)
    except HygieneReport.DoesNotExist:
        return Response({'error': 'Report not found'}, status=404)

    if report.user != request.user:
        return Response({'error': 'Permission denied'}, status=403)

    report.delete()
    return Response({'message': 'Report deleted successfully!'}, status=200)


# Submit Resolution
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_resolution(request, report_id):
    try:
        report = HygieneReport.objects.get(id=report_id)
    except HygieneReport.DoesNotExist:
        return Response({'error': 'Report not found'}, status=404)

    if report.user == request.user:
        return Response({'error': 'You cannot resolve your own report.'}, status=403)

    if report.resolution_submitted:
        return Response({'error': 'Resolution already submitted.'}, status=400)

    file = request.FILES.get('file')
    description = request.POST.get('description', '').strip()  # ✅ fetch description

    if not file:
        return Response({'error': 'Proof file is required.'}, status=400)
    
    report.resolution_submitted = True
    report.resolved_by = request.user
    report.resolution_proof = file
    report.resolution_description = description 
    report.save()

    return Response({'message': 'Resolution submitted and waiting for approval!'}, status=200)


# ✅ Approve Resolution (FIXED VERSION)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_resolution(request, report_id):
    try:
        report = HygieneReport.objects.get(id=report_id)
    except HygieneReport.DoesNotExist:
        return Response({'error': 'Report not found'}, status=404)

    if report.user != request.user:
        return Response({'error': 'Only the reporter can approve.'}, status=403)

    if not (report.resolution_submitted or report.resolution_proof):
        return Response({'error': 'No resolution has been submitted yet.'}, status=400)

    if report.is_resolved and report.is_approved:
        return Response({'message': 'Already approved'}, status=200)

    report.is_approved = True
    report.is_resolved = True
    report.resolved_at = timezone.now()
    report.save()

    # 🛠 FIX: Safe update of resolver points
    if report.resolved_by:
        profile, created = UserProfile.objects.get_or_create(user=report.resolved_by)
        profile.points += 10
        profile.save()

    return Response({'message': 'Resolution approved and issue marked as resolved!'}, status=200)


# Leaderboard
@api_view(['GET'])
def leaderboard_view(request):
    users = User.objects.all()
    data = []

    for user in users:
        resolved_count = user.resolved_issues.filter(is_approved=True).count()
        if resolved_count > 0:
            data.append({
                'username': user.username,
                'points': resolved_count * 10
            })

    data.sort(key=lambda x: x['points'], reverse=True)
    return Response(data)
