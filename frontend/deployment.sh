#!/bin/bash
# Initial Deployment Script for GetMyHelpWeb
# Run this once when setting up the server for the first time

echo "Starting initial deployment..."

# Ensure we have the latest code
git pull origin main

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application (standalone mode)..."
npm run build

# Copy necessary files to standalone directory
# Next.js standalone mode requires public and .next/static folders to be copied manually
echo "Preparing standalone assets..."
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

# Start with PM2
echo "Starting PM2 process..."
pm2 start ecosystem.config.js

# Save PM2 process list to resurrect on reboot
pm2 save

echo "Deployment complete! Application should be running on port 3000."
