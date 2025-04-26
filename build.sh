#!/bin/bash

# Production build script for GMG Underground

echo "Building GMG Underground for production..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the client
echo "Building client..."
cd client
npm install
npm run build
cd ..

# Build the server
echo "Building server..."
npm run build

# Create database migration script
echo "Preparing database migration..."
npx drizzle-kit generate:pg

echo "Build complete! Your application is ready for deployment."
echo "Use 'npm start' to run the production server."