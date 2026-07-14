#!/bin/bash
# Update Script for GetMyHelpWeb
# Run this to fetch latest changes and restart the server

echo "Starting update process..."

# Fetch latest code
git pull origin main

# Install any new dependencies
npm install

# Stop PM2 process during build to avoid EPERM file lock issues
echo "Stopping PM2 process during build..."
pm2 stop getmyhelp || true

# Clean build cache
echo "Cleaning old build cache..."
rm -rf .next

# Build the application
echo "Building the application..."
npm run build

# Restart PM2 process
echo "Starting application via PM2..."
pm2 start ecosystem.config.js --env production || pm2 restart getmyhelp

echo "Update complete! Application restarted."
