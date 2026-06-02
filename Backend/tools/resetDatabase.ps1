$ErrorActionPreference = "Stop"

# Start from script location
$Current = $PSScriptRoot

# Walk upward until we find a .csproj
$ProjectFile = $null

while ($Current -and -not $ProjectFile) {

    $found = Get-ChildItem $Current -Filter *.csproj -ErrorAction SilentlyContinue | Select-Object -First 1

    if ($found) {
        $ProjectFile = $found.FullName
        break
    }

    $parent = Split-Path $Current -Parent
    if ($parent -eq $Current) { break } # reached filesystem root
    $Current = $parent
}

if (-not $ProjectFile) {
    throw "No .csproj found by walking up from $PSScriptRoot"
}

Write-Host "Using project:" $ProjectFile -ForegroundColor Cyan

Write-Host ""
Write-Host "Dropping database..." -ForegroundColor Cyan
dotnet ef database drop --force --project "$ProjectFile" --startup-project "$ProjectFile"

Write-Host ""
Write-Host "Deleting Migrations folder..." -ForegroundColor Cyan

$Migrations = Join-Path (Split-Path $ProjectFile -Parent) "Migrations"

if (Test-Path $Migrations) {
    Remove-Item $Migrations -Recurse -Force
    Write-Host "Deleted Migrations folder"
} else {
    Write-Host "No Migrations folder found"
}

Write-Host ""
Write-Host "Creating migration..." -ForegroundColor Cyan
dotnet ef migrations add InitialCreate --project "$ProjectFile" --startup-project "$ProjectFile"

Write-Host ""
Write-Host "Updating database..." -ForegroundColor Cyan
dotnet ef database update --project "$ProjectFile" --startup-project "$ProjectFile"

Write-Host ""
Write-Host "DONE" -ForegroundColor Green
Read-Host "Press Enter to exit"