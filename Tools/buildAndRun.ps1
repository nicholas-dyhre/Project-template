$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path (Join-Path $ScriptDir "..")

Write-Host "Starting backend and frontend..." -ForegroundColor Cyan

# Backend
Start-Process powershell -ArgumentList @(
    "-NoProfile",
    "-ExecutionPolicy Bypass",
    "-NoExit",
    "-File `"$ProjectRoot\Tools\BuildAndRunBackend.ps1`""
)

# Frontend
Start-Process powershell -ArgumentList @(
    "-NoProfile",
    "-ExecutionPolicy Bypass",
    "-NoExit",
    "-File `"$ProjectRoot\Tools\BuildAndRunFrontend.ps1`""
)

Write-Host "Both processes started." -ForegroundColor Green