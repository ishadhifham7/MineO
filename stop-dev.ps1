# Stop All Development Servers
# This script stops all Node.js processes and cleans up ports

Write-Host "========================================" -ForegroundColor Red
Write-Host " Stopping MineO Development Environment" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""

# Kill all Node.js processes
Write-Host "Stopping all Node.js processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "Found $($nodeProcesses.Count) Node.js process(es)" -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force
    Write-Host "All Node.js processes stopped" -ForegroundColor Green
} else {
    Write-Host "No Node.js processes found" -ForegroundColor Green
}
Write-Host ""

# Clean up ports
Write-Host "Cleaning up ports..." -ForegroundColor Yellow
& "$PSScriptRoot\kill-ports.ps1"
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host " All servers stopped!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
