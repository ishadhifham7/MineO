# Start Backend Server Only
# This script starts only the backend server

Write-Host "Starting backend server..." -ForegroundColor Cyan

# Kill existing process on port 3001
$port3001 = netstat -ano | findstr ":3001" | findstr "LISTENING"
if ($port3001) {
    $lines = $port3001 -split "`n"
    foreach ($line in $lines) {
        if ($line -match "LISTENING") {
            $pid = ($line -split '\s+')[-1]
            Write-Host "Killing existing process on port 3001 (PID: $pid)..." -ForegroundColor Yellow
            taskkill /F /PID $pid 2>$null | Out-Null
            Start-Sleep -Milliseconds 500
        }
    }
}

# Double check port is free
Start-Sleep -Milliseconds 500
$stillRunning = netstat -ano | findstr ":3001" | findstr "LISTENING"
if ($stillRunning) {
    Write-Host "Warning: Port 3001 still in use. Trying harder..." -ForegroundColor Yellow
    $lines = $stillRunning -split "`n"
    foreach ($line in $lines) {
        if ($line -match "LISTENING") {
            $pid = ($line -split '\s+')[-1]
            taskkill /F /PID $pid 2>$null | Out-Null
        }
    }
    Start-Sleep -Seconds 1
}

Write-Host "Port 3001 is ready" -ForegroundColor Green
Write-Host "Starting server..." -ForegroundColor Cyan

# Change to server directory and start
Set-Location "$PSScriptRoot\server"
npm run dev
