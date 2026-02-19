# OctoFit Tracker Database Setup Guide

## Overview
This guide will help you set up and populate the OctoFit Tracker database with superhero test data.

## Prerequisites
- MongoDB service is running (verified ✅)
- Python virtual environment exists at `octofit-tracker/backend/venv`
- Django project configured to use MongoDB via Djongo

## Quick Setup

Run the automated setup script:

```bash
chmod +x setup_octofit_db.sh
./setup_octofit_db.sh
```

Then verify the database:

```bash
mongosh octofit_db verify_octofit_db.js
```

## Manual Setup (Step by Step)

If you prefer to run commands manually:

### Step 1: Create Migrations

```bash
octofit-tracker/backend/venv/bin/python octofit-tracker/backend/manage.py makemigrations octofit_tracker
```

Expected output: "Migrations for 'octofit_tracker'..."

### Step 2: Apply Migrations

```bash
octofit-tracker/backend/venv/bin/python octofit-tracker/backend/manage.py migrate
```

Expected output: "Running migrations..." and "Applying octofit_tracker..."

### Step 3: Populate Database

```bash
octofit-tracker/backend/venv/bin/python octofit-tracker/backend/manage.py populate_db
```

Expected output:
- Deleting existing data...
- Creating teams...
- Creating Marvel heroes...
- Creating DC heroes...
- Creating activities...
- Creating leaderboard entries...
- Creating workout suggestions...
- Successfully populated the database with superhero test data!

### Step 4: Create Email Index

```bash
mongosh octofit_db create_indexes.js
```

Expected output: "Index created successfully!"

### Step 5: Verify Database

```bash
mongosh octofit_db verify_octofit_db.js
```

This will show:
- All collections
- Document counts
- Sample data from each collection
- Top 5 leaderboard
- Indexes on users collection

## Database Structure

### Collections

1. **users** - Superhero user accounts
2. **teams** - Team Marvel and Team DC
3. **activities** - Fitness activities logged by users
4. **leaderboard** - Rankings based on calories burned
5. **workouts** - Personalized workout suggestions

### Sample Data

**Teams:**
- Team Marvel: Earth's Mightiest Heroes
- Team DC: The World's Greatest Super Heroes

**Marvel Heroes (6 users):**
- Iron Man (tony.stark@avengers.com)
- Captain America (steve.rogers@avengers.com)
- Thor (thor.odinson@asgard.com)
- Black Widow (natasha.romanoff@avengers.com)
- Hulk (bruce.banner@avengers.com)
- Spider-Man (peter.parker@avengers.com)

**DC Heroes (6 users):**
- Superman (clark.kent@dailyplanet.com)
- Batman (bruce.wayne@wayneenterprises.com)
- Wonder Woman (diana.prince@themyscira.com)
- Flash (barry.allen@starlabs.com)
- Aquaman (arthur.curry@atlantis.com)
- Cyborg (victor.stone@justiceleague.com)

**Activities (5-10 per user):**
- Running, Weightlifting, Cycling, Swimming, Boxing, Yoga, HIIT, Combat Training
- Each with duration, calories burned, and distance (where applicable)

**Workouts (8 themed suggestions):**
1. Captain America's Shield Training
2. Flash Speed Circuit
3. Thor's Hammer Slam
4. Batman's Gotham Patrol
5. Wonder Woman Warrior Training
6. Spider-Man's Wall Crawler
7. Aquaman's Ocean Power
8. Hulk Smash Strength

## Verification Checklist

After setup, verify:

- [ ] MongoDB service is running: `ps aux | grep mongod`
- [ ] Database exists: `mongosh --eval "show dbs" | grep octofit_db`
- [ ] All 5 collections exist: `mongosh octofit_db --eval "db.getCollectionNames()"`
- [ ] Users have unique email index: `mongosh octofit_db --eval "db.users.getIndexes()"`
- [ ] Data is populated: `mongosh octofit_db verify_octofit_db.js`

## Troubleshooting

### "No module named 'djongo'"
Install dependencies:
```bash
octofit-tracker/backend/venv/bin/pip install -r octofit-tracker/backend/requirements.txt
```

### "MongoDB connection failed"
Start MongoDB:
```bash
sudo systemctl start mongod
# OR
mongod --dbpath /data/db --fork --logpath /tmp/mongod.log
```

### "Migrations already exist"
Delete and recreate:
```bash
rm -rf octofit-tracker/backend/octofit_tracker/migrations/
mkdir octofit-tracker/backend/octofit_tracker/migrations/
touch octofit-tracker/backend/octofit_tracker/migrations/__init__.py
octofit-tracker/backend/venv/bin/python octofit-tracker/backend/manage.py makemigrations octofit_tracker
```

### "Duplicate key error"
Clear the database and repopulate:
```bash
mongosh octofit_db --eval "db.dropDatabase()"
octofit-tracker/backend/venv/bin/python octofit-tracker/backend/manage.py migrate
octofit-tracker/backend/venv/bin/python octofit-tracker/backend/manage.py populate_db
```

## Testing the API

Once the database is populated, you can test the Django REST API:

```bash
# Start the Django development server
octofit-tracker/backend/venv/bin/python octofit-tracker/backend/manage.py runserver 0.0.0.0:8000
```

Then access:
- Admin interface: http://localhost:8000/admin/
- API endpoints (to be created): http://localhost:8000/api/

## Next Steps

1. Create Django REST API views and serializers
2. Configure URL routing for API endpoints
3. Test API endpoints with the populated data
4. Build React frontend to consume the API
5. Implement authentication and team features

## Files Created

- `octofit-tracker/backend/octofit_tracker/models.py` - Django models for all collections
- `octofit-tracker/backend/octofit_tracker/management/commands/populate_db.py` - Data population command
- `setup_octofit_db.sh` - Automated setup script
- `verify_octofit_db.js` - MongoDB verification script
- `create_indexes.js` - Index creation script
- `SETUP_INSTRUCTIONS.md` - This file

## Support

If you encounter issues, check:
1. MongoDB is running: `ps aux | grep mongod`
2. Virtual environment is activated
3. All dependencies are installed
4. Django settings are correct in `settings.py`
