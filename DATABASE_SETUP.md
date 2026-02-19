# OctoFit Tracker Database Setup

This document explains the database initialization and population for the OctoFit Tracker application.

## What Has Been Configured

### 1. Django Settings ([octofit-tracker/backend/octofit_tracker/settings.py](octofit-tracker/backend/octofit_tracker/settings.py))

- ✅ Configured Django to use MongoDB via Djongo
- ✅ Database name: `octofit_db`
- ✅ Connection: `localhost:27017` (no authentication)
- ✅ Added `octofit_tracker` to `INSTALLED_APPS`
- ✅ Enabled CORS for all origins, methods, and headers
- ✅ Allowed all hosts (`*`)

### 2. Django Models ([octofit-tracker/backend/octofit_tracker/models.py](octofit-tracker/backend/octofit_tracker/models.py))

Created models for all required collections:
- ✅ **User**: username, email (unique), password, team_id, created_at
- ✅ **Team**: name, description, created_at
- ✅ **Activity**: user_id, activity_type, duration, calories_burned, distance, date, notes
- ✅ **Leaderboard**: user_id, username, team_id, team_name, total_activities, total_calories, total_distance, rank
- ✅ **Workout**: name, description, category, difficulty, duration, exercises, recommendations

### 3. Population Command ([octofit-tracker/backend/octofit_tracker/management/commands/populate_db.py](octofit-tracker/backend/octofit_tracker/management/commands/populate_db.py))

Django management command that populates the database with superhero-themed test data:
- ✅ **Team Marvel**: Iron Man, Captain America, Thor, Black Widow, Hulk, Spider-Man
- ✅ **Team DC**: Superman, Batman, Wonder Woman, Flash, Aquaman, Cyborg
- ✅ Activities for each hero (5-10 activities per user)
- ✅ Leaderboard rankings based on total calories
- ✅ 8 themed workout plans (e.g., "Captain America's Shield Training", "Flash Speed Circuit")

## How to Complete the Setup

Since I encountered connectivity issues with the terminal, you'll need to run these commands manually:

### Step 1: Run the Setup Script

```bash
chmod +x setup_octofit_db.sh
./setup_octofit_db.sh
```

Or manually run these commands:

```bash
source octofit-tracker/backend/venv/bin/activate
python octofit-tracker/backend/manage.py makemigrations
python octofit-tracker/backend/manage.py migrate
python octofit-tracker/backend/manage.py populate_db
```

### Step 2: Create Unique Index on Email Field

```bash
mongosh octofit_db create_indexes.js
```

### Step 3: Verify Database Population

```bash
mongosh octofit_db verify_octofit_db.js
```

Or manually check with mongosh:

```bash
mongosh
use octofit_db
show collections
db.users.countDocuments()
db.teams.find()
db.leaderboard.find().sort({rank: 1}).limit(5)
```

## Expected Results

After running the setup, you should see:

- **2 teams**: Team Marvel and Team DC
- **12 users**: 6 Marvel heroes and 6 DC heroes
- **60-120 activities**: 5-10 per user
- **12 leaderboard entries**: Ranked by total calories burned
- **8 workout plans**: Various difficulty levels and categories
- **Unique index** on the email field in the users collection

## Collections Structure

### users
```javascript
{
  _id: ObjectId,
  username: String,
  email: String (unique),
  password: String,
  team_id: String,
  created_at: DateTime
}
```

### teams
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  created_at: DateTime
}
```

### activities
```javascript
{
  _id: ObjectId,
  user_id: String,
  activity_type: String,
  duration: Number (minutes),
  calories_burned: Number,
  distance: Number (km, optional),
  date: DateTime,
  notes: String
}
```

### leaderboard
```javascript
{
  _id: ObjectId,
  user_id: String,
  username: String,
  team_id: String,
  team_name: String,
  total_activities: Number,
  total_calories: Number,
  total_distance: Number,
  rank: Number
}
```

### workouts
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  difficulty: String,
  duration: Number (minutes),
  exercises: Array,
  recommendations: Array
}
```

## Sample Superheroes Data

### Team Marvel
- ironman (tony.stark@avengers.com)
- captainamerica (steve.rogers@avengers.com)
- thor (thor.odinson@asgard.com)
- blackwidow (natasha.romanoff@avengers.com)
- hulk (bruce.banner@avengers.com)
- spiderman (peter.parker@avengers.com)

### Team DC
- superman (clark.kent@dailyplanet.com)
- batman (bruce.wayne@wayneenterprises.com)
- wonderwoman (diana.prince@themyscira.com)
- flash (barry.allen@starlabs.com)
- aquaman (arthur.curry@atlantis.com)
- cyborg (victor.stone@justiceleague.com)

## Troubleshooting

If you encounter issues:

1. **MongoDB not running**: 
   ```bash
   ps aux | grep mongod
   # If not running, start it (if needed)
   ```

2. **Migration errors**: Make sure all dependencies are installed:
   ```bash
   source octofit-tracker/backend/venv/bin/activate
   pip install -r octofit-tracker/backend/requirements.txt
   ```

3. **Djongo compatibility**: The requirements.txt includes specific versions compatible with Django 4.1.7

4. **Clear database and start over**:
   ```bash
   mongosh
   use octofit_db
   db.dropDatabase()
   exit
   # Then run the setup script again
   ```

## Next Steps

With the database populated, you can:
- Start the Django development server: `python manage.py runserver 8000`
- Create Django REST API views and endpoints for the models
- Build the React frontend to consume these APIs
- Implement user authentication
- Add real-time leaderboard updates
