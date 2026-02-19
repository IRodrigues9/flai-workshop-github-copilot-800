#!/bin/bash

# OctoFit Tracker Database Setup Script
echo "========================================="
echo "OctoFit Tracker Database Setup"
echo "========================================="

# Navigate to workspace root
cd /workspaces/flai-workshop-github-copilot-800

# Step 1: Run makemigrations
echo "Step 1: Creating migrations..."
octofit-tracker/backend/venv/bin/python octofit-tracker/backend/manage.py makemigrations octofit_tracker

# Step 2: Run migrate
echo "Step 2: Running migrations..."
octofit-tracker/backend/venv/bin/python octofit-tracker/backend/manage.py migrate

# Step 3: Populate database
echo "Step 3: Populating database with test data..."
octofit-tracker/backend/venv/bin/python octofit-tracker/backend/manage.py populate_db

# Step 4: Create unique index on email field
echo "Step 4: Creating unique index on email field..."
mongosh octofit_db create_indexes.js

echo ""
echo "========================================="
echo "Setup complete!"
echo "========================================="
echo ""
echo "To verify the database, run:"
echo "  mongosh octofit_db verify_octofit_db.js"
