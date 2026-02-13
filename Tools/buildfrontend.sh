#!/bin/bash
# buildfrontend.sh - Build Angular frontend for production

set -e  # Exit on error

echo "================================"
echo "Building Angular Frontend"
echo "================================"

cd Frontend

echo "📦 Installing dependencies..."
npm ci --cache $(Pipeline.Workspace)/.npm || npm install

echo "🔨 Building production bundle..."
npm run build -- --configuration production

echo "✅ Frontend build complete!"
echo "Output directory: Frontend/dist"

# Verify build output
if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not found!"
    exit 1
fi

echo "📊 Build statistics:"
du -sh dist/*

cd ..
