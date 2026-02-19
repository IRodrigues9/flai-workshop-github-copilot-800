// MongoDB script to create unique index on email field
// Run this with: mongosh octofit_db create_indexes.js

print("Creating unique index on email field in users collection...");

db = db.getSiblingDB('octofit_db');

// Create unique index on email field
db.users.createIndex({ "email": 1 }, { unique: true });

print("Index created successfully!");

// Verify the index
print("\nIndexes on users collection:");
db.users.getIndexes().forEach(function(index) {
    printjson(index);
});
