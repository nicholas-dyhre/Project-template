$ErrorActionPreference = "Stop"

Write-Host "Building backend" -ForegroundColor Cyan
Set-Location "$PSScriptRoot\..\backend"

dotnet build

Write-Host "Running backend" -ForegroundColor Cyan
dotnet run