from rest_framework import serializers
from .models import HygieneReport

class HygieneReportSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = HygieneReport
        fields = '__all__'
        read_only_fields = ['user']

    def get_username(self, obj):
        return obj.user.username  
