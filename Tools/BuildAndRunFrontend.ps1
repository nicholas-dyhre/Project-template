$ErrorActionPreference = "Stop"

Write-Host "Building frontend" -ForegroundColor Cyan
Set-Location "$PSScriptRoot\..\frontend"

npm install
npm run build

Write-Host "Running frontend" -ForegroundColor Cyan
npm start