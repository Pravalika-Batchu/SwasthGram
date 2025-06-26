# hygiene/models.py

from django.db import models

class HygieneReport(models.Model):
    issue_type = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to='proofs/', blank=True, null=True)

    def __str__(self):
        return f"{self.issue_type} at ({self.latitude}, {self.longitude})"
