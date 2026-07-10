from django.urls import path, include
from . import views

urlpatterns = [
    # Authentication
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    
    # Planner
    path('setup/', views.setup_planner, name='setup'),
    path('dashboard/', views.get_dashboard_data, name='dashboard'),
    path('generate-schedule/', views.generate_schedule, name='generate-schedule'),
    path('progress/', views.get_progress, name='progress'),
    
    # Subjects
    path('subjects/', views.subject_list, name='subject-list'),
    path('subjects/<int:pk>/', views.subject_detail, name='subject-detail'),
    
    # Topics
    path('topics/', views.topic_list, name='topic-list'),
    path('topics/<int:pk>/', views.topic_detail, name='topic-detail'),
    
    # Pomodoro Timer
    path('pomodoro-stats/', views.get_pomodoro_stats, name='pomodoro-stats'),
    path('pomodoro-increment/', views.increment_pomodoro, name='pomodoro-increment'),
    path('save-timer-state/', views.save_timer_state, name='save-timer-state'),
    
    # Password Reset
    path('password-reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
]