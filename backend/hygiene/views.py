from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import HygieneReport
from .serializers import HygieneReportSerializer

@api_view(['GET', 'POST'])
def reports_view(request):
    if request.method == 'POST':
        serializer = HygieneReportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Report saved successfully'})
        return Response(serializer.errors, status=400)

    elif request.method == 'GET':
        reports = HygieneReport.objects.all()
        serializer = HygieneReportSerializer(reports, many=True)
        return Response(serializer.data)
    

from django.http import JsonResponse
from .models import HygieneReport
from django.utils.timezone import now
from datetime import datetime
from geopy.distance import geodesic

def is_rainy_season():
    """Returns True if current month is June–September"""
    month = datetime.now().month
    return 6 <= month <= 9

def high_risk_zones(request):
    if not is_rainy_season():
        return JsonResponse([], safe=False)  # No risks outside rainy season

    stagnant_reports = HygieneReport.objects.filter(issue_type='stagnant_water')
    stagnant_coords = [(r.latitude, r.longitude) for r in stagnant_reports]

    high_risk_clusters = []

    for i, coord1 in enumerate(stagnant_coords):
        count = 1
        for j, coord2 in enumerate(stagnant_coords):
            if i != j and geodesic(coord1, coord2).km <= 1.0:
                count += 1
        if count >= 2 and coord1 not in high_risk_clusters:
            high_risk_clusters.append(coord1)

    return JsonResponse(high_risk_clusters, safe=False)

