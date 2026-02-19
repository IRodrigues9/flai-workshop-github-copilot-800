from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Deleting existing data...')
        
        # Delete existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('Successfully deleted existing data'))
        
        # Create Teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='Earth\'s Mightiest Heroes'
        )
        team_dc = Team.objects.create(
            name='Team DC',
            description='The World\'s Greatest Super Heroes'
        )
        self.stdout.write(self.style.SUCCESS(f'Created teams: {team_marvel.name}, {team_dc.name}'))
        
        # Create Users - Marvel Heroes
        self.stdout.write('Creating Marvel heroes...')
        marvel_heroes = [
            {'username': 'ironman', 'email': 'tony.stark@avengers.com', 'password': 'arc_reactor_3000'},
            {'username': 'captainamerica', 'email': 'steve.rogers@avengers.com', 'password': 'shield_forever'},
            {'username': 'thor', 'email': 'thor.odinson@asgard.com', 'password': 'mjolnir_worthy'},
            {'username': 'blackwidow', 'email': 'natasha.romanoff@avengers.com', 'password': 'red_room_graduate'},
            {'username': 'hulk', 'email': 'bruce.banner@avengers.com', 'password': 'smash_mode_activated'},
            {'username': 'spiderman', 'email': 'peter.parker@avengers.com', 'password': 'with_great_power'},
        ]
        
        marvel_users = []
        for hero in marvel_heroes:
            user = User.objects.create(
                username=hero['username'],
                email=hero['email'],
                password=hero['password'],
                team_id=str(team_marvel._id)
            )
            marvel_users.append(user)
        
        # Create Users - DC Heroes
        self.stdout.write('Creating DC heroes...')
        dc_heroes = [
            {'username': 'superman', 'email': 'clark.kent@dailyplanet.com', 'password': 'kryptonite_free'},
            {'username': 'batman', 'email': 'bruce.wayne@wayneenterprises.com', 'password': 'gotham_knight'},
            {'username': 'wonderwoman', 'email': 'diana.prince@themyscira.com', 'password': 'lasso_of_truth'},
            {'username': 'flash', 'email': 'barry.allen@starlabs.com', 'password': 'speed_force_rules'},
            {'username': 'aquaman', 'email': 'arthur.curry@atlantis.com', 'password': 'king_of_seas'},
            {'username': 'cyborg', 'email': 'victor.stone@justiceleague.com', 'password': 'booyah_activated'},
        ]
        
        dc_users = []
        for hero in dc_heroes:
            user = User.objects.create(
                username=hero['username'],
                email=hero['email'],
                password=hero['password'],
                team_id=str(team_dc._id)
            )
            dc_users.append(user)
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(marvel_users)} Marvel heroes and {len(dc_users)} DC heroes'))
        
        # Create Activities
        self.stdout.write('Creating activities...')
        activity_types = ['Running', 'Weightlifting', 'Cycling', 'Swimming', 'Boxing', 'Yoga', 'HIIT', 'Combat Training']
        all_users = marvel_users + dc_users
        activities = []
        
        for user in all_users:
            # Create 5-10 activities per user
            num_activities = random.randint(5, 10)
            for i in range(num_activities):
                activity_type = random.choice(activity_types)
                duration = random.randint(20, 120)
                calories_burned = int(duration * random.uniform(5, 12))
                distance = round(random.uniform(2, 15), 2) if activity_type in ['Running', 'Cycling', 'Swimming'] else None
                activity_date = datetime.now() - timedelta(days=random.randint(0, 30))
                
                activity = Activity.objects.create(
                    user_id=str(user._id),
                    activity_type=activity_type,
                    duration=duration,
                    calories_burned=calories_burned,
                    distance=distance,
                    date=activity_date,
                    notes=f'{activity_type} session by {user.username}'
                )
                activities.append(activity)
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(activities)} activities'))
        
        # Create Leaderboard entries
        self.stdout.write('Creating leaderboard entries...')
        leaderboard_entries = []
        
        for user in all_users:
            user_activities = [a for a in activities if a.user_id == str(user._id)]
            total_activities = len(user_activities)
            total_calories = sum(a.calories_burned for a in user_activities)
            total_distance = sum(a.distance for a in user_activities if a.distance is not None)
            
            team = team_marvel if user.team_id == str(team_marvel._id) else team_dc
            
            leaderboard = Leaderboard.objects.create(
                user_id=str(user._id),
                username=user.username,
                team_id=str(team._id),
                team_name=team.name,
                total_activities=total_activities,
                total_calories=total_calories,
                total_distance=round(total_distance, 2),
                rank=0
            )
            leaderboard_entries.append(leaderboard)
        
        # Assign ranks based on total calories
        leaderboard_entries.sort(key=lambda x: x.total_calories, reverse=True)
        for idx, entry in enumerate(leaderboard_entries):
            entry.rank = idx + 1
            entry.save()
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(leaderboard_entries)} leaderboard entries'))
        
        # Create Workouts
        self.stdout.write('Creating workout suggestions...')
        workouts = [
            {
                'name': 'Captain America\'s Shield Training',
                'description': 'Build upper body strength and endurance like the First Avenger',
                'category': 'Strength',
                'difficulty': 'Advanced',
                'duration': 45,
                'exercises': [
                    {'name': 'Shield Throws (Medicine Ball)', 'sets': 4, 'reps': 15},
                    {'name': 'Pull-ups', 'sets': 4, 'reps': 12},
                    {'name': 'Push-ups', 'sets': 4, 'reps': 20},
                    {'name': 'Dumbbell Rows', 'sets': 3, 'reps': 15}
                ],
                'recommendations': ['Focus on explosive power', 'Maintain proper form']
            },
            {
                'name': 'Flash Speed Circuit',
                'description': 'High-intensity interval training for maximum speed',
                'category': 'Cardio',
                'difficulty': 'Intermediate',
                'duration': 30,
                'exercises': [
                    {'name': 'Sprint Intervals', 'sets': 6, 'duration': '30 seconds'},
                    {'name': 'Burpees', 'sets': 3, 'reps': 15},
                    {'name': 'Jump Squats', 'sets': 3, 'reps': 20},
                    {'name': 'Mountain Climbers', 'sets': 3, 'duration': '45 seconds'}
                ],
                'recommendations': ['Warm up properly', 'Stay hydrated']
            },
            {
                'name': 'Thor\'s Hammer Slam',
                'description': 'Full-body power workout worthy of Mjolnir',
                'category': 'Strength',
                'difficulty': 'Advanced',
                'duration': 50,
                'exercises': [
                    {'name': 'Sledgehammer Slams', 'sets': 4, 'reps': 20},
                    {'name': 'Deadlifts', 'sets': 4, 'reps': 8},
                    {'name': 'Overhead Press', 'sets': 4, 'reps': 10},
                    {'name': 'Battle Ropes', 'sets': 3, 'duration': '45 seconds'}
                ],
                'recommendations': ['Focus on controlled power', 'Engage your core']
            },
            {
                'name': 'Batman\'s Gotham Patrol',
                'description': 'Endurance training for vigilant crime-fighting',
                'category': 'Cardio',
                'difficulty': 'Intermediate',
                'duration': 40,
                'exercises': [
                    {'name': 'Running', 'sets': 1, 'duration': '20 minutes'},
                    {'name': 'Box Jumps', 'sets': 3, 'reps': 15},
                    {'name': 'Jump Rope', 'sets': 3, 'duration': '2 minutes'},
                    {'name': 'Stairs Climbing', 'sets': 5, 'reps': 20}
                ],
                'recommendations': ['Maintain steady pace', 'Cool down properly']
            },
            {
                'name': 'Wonder Woman Warrior Training',
                'description': 'Combat-ready functional fitness from Themyscira',
                'category': 'Mixed',
                'difficulty': 'Advanced',
                'duration': 55,
                'exercises': [
                    {'name': 'Lunge Variations', 'sets': 4, 'reps': 12},
                    {'name': 'Kettlebell Swings', 'sets': 4, 'reps': 15},
                    {'name': 'Turkish Get-ups', 'sets': 3, 'reps': 6},
                    {'name': 'Planks', 'sets': 3, 'duration': '90 seconds'}
                ],
                'recommendations': ['Focus on balance and control', 'Breathe steadily']
            },
            {
                'name': 'Spider-Man\'s Wall Crawler',
                'description': 'Flexibility and agility training like your friendly neighborhood hero',
                'category': 'Flexibility',
                'difficulty': 'Beginner',
                'duration': 25,
                'exercises': [
                    {'name': 'Dynamic Stretching', 'sets': 1, 'duration': '5 minutes'},
                    {'name': 'Yoga Flow', 'sets': 1, 'duration': '15 minutes'},
                    {'name': 'Core Stretches', 'sets': 1, 'duration': '5 minutes'}
                ],
                'recommendations': ['Move slowly and controlled', 'Listen to your body']
            },
            {
                'name': 'Aquaman\'s Ocean Power',
                'description': 'Swimming-focused workout for total body conditioning',
                'category': 'Swimming',
                'difficulty': 'Intermediate',
                'duration': 45,
                'exercises': [
                    {'name': 'Freestyle Swimming', 'sets': 4, 'distance': '400m'},
                    {'name': 'Backstroke', 'sets': 2, 'distance': '200m'},
                    {'name': 'Underwater Swimming', 'sets': 4, 'distance': '25m'},
                    {'name': 'Treading Water', 'sets': 3, 'duration': '3 minutes'}
                ],
                'recommendations': ['Focus on breathing technique', 'Rest between sets']
            },
            {
                'name': 'Hulk Smash Strength',
                'description': 'Maximum strength and power development',
                'category': 'Strength',
                'difficulty': 'Advanced',
                'duration': 60,
                'exercises': [
                    {'name': 'Barbell Squats', 'sets': 5, 'reps': 5},
                    {'name': 'Bench Press', 'sets': 5, 'reps': 5},
                    {'name': 'Deadlifts', 'sets': 5, 'reps': 5},
                    {'name': 'Clean and Press', 'sets': 4, 'reps': 6}
                ],
                'recommendations': ['Use proper form always', 'Have a spotter available']
            }
        ]
        
        for workout_data in workouts:
            Workout.objects.create(**workout_data)
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(workouts)} workout suggestions'))
        
        self.stdout.write(self.style.SUCCESS('Successfully populated the database with superhero test data!'))
        self.stdout.write(self.style.SUCCESS(f'Total: {User.objects.count()} users, {Team.objects.count()} teams, '
                                           f'{Activity.objects.count()} activities, {Leaderboard.objects.count()} '
                                           f'leaderboard entries, {Workout.objects.count()} workouts'))
