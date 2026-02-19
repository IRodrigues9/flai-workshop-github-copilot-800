// MongoDB verification script for OctoFit Tracker
// Run this with: mongosh octofit_db verify_octofit_db.js

print("========================================");
print("OctoFit Database Verification");
print("========================================");

// Switch to octofit_db
db = db.getSiblingDB('octofit_db');

// List all collections
print("\n1. Collections in octofit_db:");
const collections = db.getCollectionNames();
collections.forEach(function(collection) {
    print("   - " + collection);
});

// Count documents in each collection
print("\n2. Document counts:");
collections.forEach(function(collection) {
    const count = db.getCollection(collection).countDocuments();
    print("   " + collection + ": " + count + " documents");
});

// Show sample users
print("\n3. Sample users:");
db.users.find().limit(3).forEach(function(doc) {
    print("   - " + doc.username + " (" + doc.email + ") - Team: " + doc.team_id);
});

// Show teams
print("\n4. Teams:");
db.teams.find().forEach(function(doc) {
    print("   - " + doc.name + ": " + doc.description);
});

// Show sample activities
print("\n5. Sample activities:");
db.activities.find().limit(3).forEach(function(doc) {
    print("   - User: " + doc.user_id + ", Type: " + doc.activity_type + 
          ", Duration: " + doc.duration + " min, Calories: " + doc.calories_burned);
});

// Show top 5 leaderboard
print("\n6. Top 5 Leaderboard:");
db.leaderboard.find().sort({rank: 1}).limit(5).forEach(function(doc) {
    print("   #" + doc.rank + ". " + doc.username + " (" + doc.team_name + 
          ") - " + doc.total_calories + " calories, " + doc.total_activities + " activities");
});

// Show sample workouts
print("\n7. Sample workouts:");
db.workouts.find().limit(2).forEach(function(doc) {
    print("   - " + doc.name + " (" + doc.category + ", " + doc.difficulty + ")");
    print("     Duration: " + doc.duration + " min");
});

// Verify email index
print("\n8. Indexes on users collection:");
db.users.getIndexes().forEach(function(index) {
    print("   - " + JSON.stringify(index.key));
});

print("\n========================================");
print("Verification complete!");
print("========================================");
