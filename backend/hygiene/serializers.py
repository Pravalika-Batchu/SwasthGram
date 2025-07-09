from rest_framework import serializers
from .models import HygieneReport

class HygieneReportSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    resolution_proof_url = serializers.SerializerMethodField()

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

    def get_resolution_proof_url(self, obj):
        request = self.context.get('request')
        if obj.resolution_proof and request:
            return request.build_absolute_uri(obj.resolution_proof.url)
        return None

    class Meta:
        model = HygieneReport
        fields = '__all__'  # or list all required fields manually + the two above
        read_only_fields = ['user']