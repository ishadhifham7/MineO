# Kill processes on ports 3001 and 8081
# Run this if you get "EADDRINUSE" errors

Write-Host "Checking for processes on ports 3001 and 8081..." -ForegroundColor Cyan

# Find and kill port 3001 (Backend)
$port3001 = netstat -ano | findstr ":3001" | findstr "LISTENING"
if ($port3001) {
    $pid = ($port3001 -split '\s+')[-1]
    Write-Host "Killing process on port 3001 (PID: $pid)" -ForegroundColor Yellow
    taskkill /F /PID $pid 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully killed process on port 3001" -ForegroundColor Green
    }
} else {
    Write-Host "Port 3001 is free" -ForegroundColor Green
}

# Find and kill port 8081 (Expo)
$port8081 = netstat -ano | findstr ":8081" | findstr "LISTENING" | Select-Object -First 1
if ($port8081) {
    $pid = ($port8081 -split '\s+')[-1]
    Write-Host "Killing process on port 8081 (PID: $pid)" -ForegroundColor Yellow
    taskkill /F /PID $pid 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully killed process on port 8081" -ForegroundColor Green
    }
} else {
    Write-Host "Port 8081 is free" -ForegroundColor Green
}

Write-Host "`nDone! You can now start your servers." -ForegroundColor Green
