#!/bin/bash
# buildbackend.sh - Build .NET backend for production

set -e  # Exit on error

echo "================================"
echo "Building .NET Backend"
echo "================================"

cd Backend

echo "📦 Restoring NuGet packages..."
dotnet restore

echo "🔨 Building in Release configuration..."
dotnet build --configuration Release --no-restore

echo "📤 Publishing application..."
dotnet publish \
    --configuration Release \
    --output bin/Release/net10.0/publish \
    --no-build \
    --no-restore

echo "✅ Backend build complete!"
echo "Output directory: Backend/bin/Release/net10.0/publish"

# Verify publish output
if [ ! -d "bin/Release/net10.0/publish" ]; then
    echo "❌ Error: publish directory not found!"
    exit 1
fi

echo "📊 Build statistics:"
du -sh bin/Release/net10.0/publish

cd ..
