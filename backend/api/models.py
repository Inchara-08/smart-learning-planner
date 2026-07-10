from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    exam_date = models.DateField(null=True, blank=True)
    goal = models.TextField(blank=True)
    daily_study_hours = models.IntegerField(default=4)
    weak_subjects = models.TextField(blank=True)
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_study_date = models.DateField(null=True, blank=True)
    total_study_minutes = models.IntegerField(default=0)
    pomodoro_sessions = models.IntegerField(default=0)
    timer_state = models.JSONField(default=dict, blank=True)  # Add this line
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username}'s profile"

class Subject(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    confidence = models.IntegerField(default=50)
    is_weak = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name

class Topic(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    confidence = models.IntegerField(default=50)
    hours_needed = models.IntegerField(default=2)
    is_completed = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name

class StudyTask(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=200)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_completed = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title