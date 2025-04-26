#!/bin/bash

# Script to build the static HTML version of GMG Underground
echo "Building GMG Underground - Static HTML Version"

# Step 1: Build the client
echo "Building React application..."
cd client
npm install
npm run build

# Step 2: Generate static data files
echo "Generating static data..."
node static-build.js

# Step 3: Create a ZIP file with the static version
echo "Creating ZIP archive..."
cd dist
zip -r ../../export/gmg-underground-static-html.zip *

# Done
echo "Static HTML build complete!"
echo "The static HTML version is available at:"
echo "- Client build: client/dist/"
echo "- ZIP archive: export/gmg-underground-static-html.zip"
echo ""
echo "To use this static HTML version:"
echo "1. Extract the ZIP file to any web hosting service"
echo "2. No database or Node.js required"