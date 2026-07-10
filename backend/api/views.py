from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta
from .models import *
from .serializers import *

# ============ POMODORO TIMER VIEWS ============

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pomodoro_stats(request):
    try:
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        return Response({
            'sessions': profile.pomodoro_sessions,
            'total_minutes': profile.total_study_minutes,
            'timer_state': profile.timer_state
        })
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_timer_state(request):
    try:
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        profile.timer_state = request.data
        profile.save()
        return Response({'status': 'saved'})
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def increment_pomodoro(request):
    try:
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        profile.pomodoro_sessions += 1
        profile.total_study_minutes += 25
        # Reset timer state after session
        profile.timer_state = {
            'minutes': 5,
            'seconds': 0,
            'isActive': False,
            'sessionType': 'break'
        }
        profile.save()
        return Response({
            'sessions': profile.pomodoro_sessions,
            'total_minutes': profile.total_study_minutes,
            'timer_state': profile.timer_state,
            'message': 'Session saved!'
        })
    except Exception as e:
        return Response({'error': str(e)}, status=400)

# ============ AUTHENTICATION VIEWS ============

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username exists'}, status=400)
    
    user = User.objects.create_user(username=username, password=password)
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user_id': user.id
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user_id': user.id,
            'username': user.username
        })
    
    return Response({'error': 'Invalid credentials'}, status=401)

# ============ PLANNER VIEWS ============

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def setup_planner(request):
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    profile.exam_date = request.data.get('exam_date')
    profile.goal = request.data.get('goal')
    profile.daily_study_hours = request.data.get('daily_study_hours', 4)
    profile.weak_subjects = request.data.get('weak_subjects', '')
    profile.save()
    
    return Response({'status': 'success'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dashboard_data(request):
    today = timezone.now().date()
    today_tasks = StudyTask.objects.filter(user=request.user, date=today)
    tasks_serializer = StudyTaskSerializer(today_tasks, many=True)
    
    subjects = Subject.objects.filter(user=request.user)
    subjects_serializer = SubjectSerializer(subjects, many=True)
    
    # Get profile
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    # ============================================
    # GENERATE STUDY PLAN
    # ============================================
    study_plan = None
    if subjects.exists():
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        sorted_subjects = sorted(subjects, key=lambda s: (not s.is_weak, s.confidence))
        weak_subjects_list = [s.strip() for s in profile.weak_subjects.split(',') if s.strip()]
        
        schedule = []
        for idx, subject in enumerate(sorted_subjects):
            day = days[idx % 5]
            if subject.is_weak or subject.name in weak_subjects_list:
                priority = 'High Priority 🔴'
                hours = 3
            elif subject.confidence < 50:
                priority = 'Medium Priority 🟡'
                hours = 2
            else:
                priority = 'Low Priority 🟢'
                hours = 1
            schedule.append({
                'subject': subject.name,
                'day': day,
                'priority': priority,
                'hours': hours
            })
        
        study_plan = {
            'schedule': schedule,
            'total_hours': sum(item['hours'] for item in schedule),
            'exam_date': profile.exam_date,
            'goal': profile.goal,
            'daily_hours': profile.daily_study_hours,
            'weak_subjects': profile.weak_subjects
        }
    # ============================================
    
    return Response({
        'today_tasks': tasks_serializer.data,
        'subjects': subjects_serializer.data,
        'streak': profile.current_streak,
        'study_plan': study_plan  # Make sure this is included
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_schedule(request):
    try:
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        subjects = Subject.objects.filter(user=request.user)
        
        if not subjects.exists():
            return Response({'error': 'No subjects found. Please add subjects first.'}, status=400)
        
        schedule = []
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        
        sorted_subjects = sorted(subjects, key=lambda s: (not s.is_weak, s.confidence))
        
        weak_subjects_list = [s.strip() for s in profile.weak_subjects.split(',') if s.strip()]
        
        for idx, subject in enumerate(sorted_subjects):
            day = days[idx % 5]
            
            if subject.is_weak or subject.name in weak_subjects_list:
                priority = 'High Priority 🔴'
                hours = 3
                reason = 'Weak subject needs extra attention'
            elif subject.confidence < 50:
                priority = 'Medium Priority 🟡'
                hours = 2
                reason = f'Confidence at {subject.confidence}% - needs improvement'
            else:
                priority = 'Low Priority 🟢'
                hours = 1
                reason = f'Confidence at {subject.confidence}% - on track'
            
            schedule.append({
                'subject': subject.name,
                'day': day,
                'priority': priority,
                'hours': hours,
                'reason': reason
            })
        
        return Response({
            'schedule': schedule,
            'total_hours': sum(item['hours'] for item in schedule),
            'exam_date': profile.exam_date,
            'goal': profile.goal
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_progress(request):
    try:
        subjects = Subject.objects.filter(user=request.user)
        topics = Topic.objects.filter(subject__user=request.user)
        
        total_subjects = subjects.count()
        weak_subjects = subjects.filter(is_weak=True).count()
        strong_subjects = subjects.filter(confidence__gte=70).count()
        
        total_topics = topics.count()
        completed_topics = topics.filter(is_completed=True).count()
        
        avg_confidence = 0
        if total_subjects > 0:
            avg_confidence = round(sum(s.confidence for s in subjects) / total_subjects)
        
        return Response({
            'total_subjects': total_subjects,
            'weak_subjects': weak_subjects,
            'strong_subjects': strong_subjects,
            'total_topics': total_topics,
            'completed_topics': completed_topics,
            'avg_confidence': avg_confidence,
            'completion_rate': round((completed_topics / total_topics * 100) if total_topics > 0 else 0)
        })
    except Exception as e:
        return Response({'error': str(e)}, status=400)

# ============ SUBJECT VIEWS ============

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def subject_list(request):
    if request.method == 'GET':
        subjects = Subject.objects.filter(user=request.user)
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = SubjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def subject_detail(request, pk):
    try:
        subject = Subject.objects.get(pk=pk, user=request.user)
    except Subject.DoesNotExist:
        return Response({'error': 'Subject not found'}, status=404)
    
    if request.method == 'GET':
        serializer = SubjectSerializer(subject)
        return Response(serializer.data)
    
    elif request.method in ['PUT', 'PATCH']:
        serializer = SubjectSerializer(subject, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    elif request.method == 'DELETE':
        subject.delete()
        return Response({'message': 'Subject deleted'}, status=204)

# ============ TOPIC VIEWS ============

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def topic_list(request):
    if request.method == 'GET':
        subject_id = request.query_params.get('subject')
        if subject_id:
            topics = Topic.objects.filter(subject_id=subject_id, subject__user=request.user)
        else:
            topics = Topic.objects.filter(subject__user=request.user)
        serializer = TopicSerializer(topics, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = TopicSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def topic_detail(request, pk):
    try:
        topic = Topic.objects.get(pk=pk, subject__user=request.user)
    except Topic.DoesNotExist:
        return Response({'error': 'Topic not found'}, status=404)
    
    if request.method == 'GET':
        serializer = TopicSerializer(topic)
        return Response(serializer.data)
    
    elif request.method in ['PUT', 'PATCH']:
        serializer = TopicSerializer(topic, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    elif request.method == 'DELETE':
        topic.delete()
        return Response({'message': 'Topic deleted'}, status=204)