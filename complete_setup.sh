#!/bin/bash

# Complete OctoFit Tracker Setup and Verification Script
echo "========================================="
echo "OctoFit Tracker - Complete Setup"
echo "========================================="
echo ""

# Navigate to workspace root
cd /workspaces/flai-workshop-github-copilot-800

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Verify MongoDB is running
echo -e "${BLUE}Step 1: Verifying MongoDB service...${NC}"
if ps aux | grep -v grep | grep mongod > /dev/null; then
    echo -e "${GREEN}✓ MongoDB is running${NC}"
else
    echo -e "${YELLOW}⚠ MongoDB is not running. Starting MongoDB...${NC}"
    mongod --dbpath /data/db --fork --logpath /tmp/mongod.log
    sleep 2
fi
echo ""

# Step 2: Run makemigrations
echo -e "${BLUE}Step 2: Creating migrations...${NC}"
octofit-tracker/backend/venv/bin/python octofit-tracker/backend/manage.py makemigrations octofit_tracker
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Migrations created successfully${NC}"
else
    echo -e "${YELLOW}⚠ Migrations already exist or failed${NC}"
fi
echo ""

# Step 3: Run migrate
echo -e "${BLUE}Step 3: Applying migrations...${NC}"
octofit-tracker/backend/venv/bin/python octofit-tracker/backend/manage.py migrate
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Migrations applied successfully${NC}"
else
    echo -e "${YELLOW}⚠ Migrations failed${NC}"
    exit 1
fi
echo ""

# Step 4: Populate database
echo -e "${BLUE}Step 4: Populating database with superhero test data...${NC}"
octofit-tracker/backend/venv/bin/python octofit-tracker/backend/manage.py populate_db
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database populated successfully${NC}"
else
    echo -e "${YELLOW}⚠ Database population failed${NC}"
    exit 1
fi
echo ""

# Step 5: Create unique index on email field
echo -e "${BLUE}Step 5: Creating unique index on email field...${NC}"
mongosh octofit_db create_indexes.js
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Index created successfully${NC}"
else
    echo -e "${YELLOW}⚠ Index creation failed${NC}"
fi
echo ""

# Step 6: Verify database
echo ""
echo "========================================="
echo -e "${BLUE}Verification Results${NC}"
echo "========================================="
echo ""
mongosh octofit_db verify_octofit_db.js

echo ""
echo "========================================="
echo -e "${GREEN}Setup Complete!${NC}"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Start the Django server:"
echo "   octofit-tracker/backend/venv/bin/python octofit-tracker/backend/manage.py runserver 0.0.0.0:8000"
echo ""
echo "2. In a new terminal, start the React frontend:"
echo "   cd octofit-tracker/frontend && npm start"
echo ""
echo "3. Access the application:"
echo "   - Backend: http://localhost:8000"
echo "   - Frontend: http://localhost:3000"
echo ""
