# Start Development Environment
# This script starts both the backend server and the client

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Starting MineO Development Environment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill existing processes
Write-Host "[1/3] Cleaning up existing processes..." -ForegroundColor Yellow
& "$PSScriptRoot\kill-ports.ps1"
Write-Host ""

# Step 2: Start backend server
Write-Host "[2/3] Starting backend server on port 3001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; .\start-server.ps1" -WindowStyle Normal
Write-Host "Backend server starting in new window..." -ForegroundColor Green
Start-Sleep -Seconds 5
Write-Host ""

# Step 3: Start client
Write-Host "[3/3] Starting Expo client..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; npm start" -WindowStyle Normal
Write-Host "Expo client starting in new window..." -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host " Development environment started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend Server:" -ForegroundColor Cyan
Write-Host "  - Running on http://localhost:3001" -ForegroundColor White
Write-Host "  - API Docs: http://localhost:3001/docs" -ForegroundColor White
Write-Host ""
Write-Host "Client:" -ForegroundColor Cyan
Write-Host "  - Expo DevTools will open automatically" -ForegroundColor White
Write-Host "  - Scan QR code with Expo Go app" -ForegroundColor White
Write-Host ""
Write-Host "To stop all servers, close the PowerShell windows or run:" -ForegroundColor Yellow
Write-Host "  .\kill-ports.ps1" -ForegroundColor White
Write-Host ""
