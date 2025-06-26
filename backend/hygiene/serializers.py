from rest_framework import serializers
from .models import HygieneReport

class HygieneReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = HygieneReport
        fields = '__all__' 