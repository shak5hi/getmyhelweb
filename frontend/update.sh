#!/bin/bash
# Update Script for GetMyHelpWeb
# Run this to fetch latest changes and restart the server

echo "Starting update process..."

# Fetch latest code
git pull origin main

# Install any new dependencies
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
pm2 restart ecosystem.config.js

echo "Update complete! Application restarted."
