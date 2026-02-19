from django.contrib import admin
from .models import User, Team, Activity, Leaderboard, Workout


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'team_id', 'created_at']
    search_fields = ['username', 'email']


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name']


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['user_id', 'activity_type', 'duration', 'calories_burned', 'date']
    list_filter = ['activity_type']
    search_fields = ['user_id', 'activity_type']


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ['username', 'team_name', 'total_activities', 'total_calories', 'total_distance', 'rank']
    ordering = ['rank']
    search_fields = ['username', 'team_name']


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'difficulty', 'duration']
    list_filter = ['category', 'difficulty']
    search_fields = ['name', 'category']
