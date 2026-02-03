@echo off
SETLOCAL

echo ==========================================
echo       EF Seeder / Migration Script
echo ==========================================

echo.
echo BEFORE RUNNING: Make sure the NSwag Target in your .csproj is COMMENTED out.
echo This prevents generating the client while resetting the database.
echo.

:checkNSwag
set /p nswagCommented="Have you commented the NSwag target? (y/n): "
if /I "%nswagCommented%" NEQ "y" (
    echo Please comment out the NSwag target in your .csproj before proceeding.
    goto checkNSwag
)

echo.
echo Dropping database...
dotnet ef database drop --force

echo.
echo Deleting existing Migrations folder...
if exist Migrations (
    rmdir /s /q Migrations
    echo Migrations folder deleted.
) else (
    echo No Migrations folder found.
)

echo.
echo Creating initial migration...
dotnet ef migrations add InitialCreate

echo.
echo Updating database...
dotnet ef database update

echo.
echo ==========================================
echo       DONE
echo ==========================================
echo REMEMBER: Uncomment the NSwag Target in your .csproj if needed.
pause
