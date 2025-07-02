# hygiene/models.py

from django.db import models
from django.contrib.auth.models import User


class HygieneReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    issue_type = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to='proofs/', blank=True, null=True)
    resolution_submitted = models.BooleanField(default=False)
    is_resolved = models.BooleanField(default=False)
    resolved_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='resolved_issues')
    resolution_proof = models.FileField(upload_to='resolution_proofs/', null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    # Add to HygieneReport model
    is_approved = models.BooleanField(default=False)
    resolver_points_awarded = models.BooleanField(default=False)


    def __str__(self):
        return f"{self.issue_type} at ({self.latitude}, {self.longitude})"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    points = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username

