#!/bin/bash
# combine-artifacts.sh - Combine frontend and backend into single deployable package

set -e  # Exit on error

echo "================================"
echo "Combining Artifacts"
echo "================================"

# Environment variables set by pipeline:
# FRONTEND_PATH - Path to frontend build output
# BACKEND_PATH - Path to backend publish output
# OUTPUT_PATH - Path where combined output should be placed

echo "Frontend path: $FRONTEND_PATH"
echo "Backend path: $BACKEND_PATH"
echo "Output path: $OUTPUT_PATH"

# Create output directory
mkdir -p "$OUTPUT_PATH"

echo "📦 Copying backend files..."
cp -r "$BACKEND_PATH"/* "$OUTPUT_PATH"/

echo "📦 Copying frontend files to wwwroot..."
mkdir -p "$OUTPUT_PATH/wwwroot"
cp -r "$FRONTEND_PATH"/* "$OUTPUT_PATH/wwwroot"/

echo "✅ Artifacts combined successfully!"

# Verify combined structure
echo "📊 Combined structure:"
echo "Backend files:"
ls -lh "$OUTPUT_PATH" | head -10

echo ""
echo "Frontend files (wwwroot):"
ls -lh "$OUTPUT_PATH/wwwroot" | head -10

# Verify critical files exist
if [ ! -f "$OUTPUT_PATH/wwwroot/index.html" ]; then
    echo "❌ Error: index.html not found in wwwroot!"
    exit 1
fi

if [ ! -f "$OUTPUT_PATH/Backend.dll" ]; then
    echo "❌ Error: Backend.dll not found!"
    exit 1
fi

echo "✅ All critical files present!"
