#!/bin/bash
# Rollback Script for GetMyHelpWeb
# Run this to revert to the previous commit and restart the server

echo "Starting rollback process..."

# Revert to previous commit
git reset --hard HEAD~1

# Re-install dependencies to match the reverted commit
npm install

# Build the application
echo "Building the application..."
npm run build

# Copy necessary files to standalone directory
echo "Updating standalone assets..."
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

# Restart PM2 process
echo "Restarting application via PM2..."
pm2 restart getmyhelp

echo "Rollback complete! Application has been reverted and restarted."
