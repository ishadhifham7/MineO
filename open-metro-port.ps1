# Run this once as Administrator to allow your phone to reach both:
# - Metro Bundler (8081)
# - MineO backend API (3001)

$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "❌ Please run this script as Administrator." -ForegroundColor Red
    Write-Host "   Right-click the file and choose 'Run with PowerShell'." -ForegroundColor Yellow
    Read-Host "Press Enter to close"
    exit 1
}

function Ensure-FirewallRule {
    param(
        [string]$RuleName,
        [int]$Port,
        [string]$Description
    )

    $existing = Get-NetFirewallRule -DisplayName $RuleName -ErrorAction SilentlyContinue
    if ($existing) {
        Write-Host "✅ Firewall rule already exists: $RuleName" -ForegroundColor Green
        return
    }

    New-NetFirewallRule `
        -DisplayName $RuleName `
        -Direction Inbound `
        -Protocol TCP `
        -LocalPort $Port `
        -Action Allow `
        -Profile Private,Public `
        -Description $Description | Out-Null

    Write-Host "✅ Firewall rule added: $RuleName" -ForegroundColor Green
}

Ensure-FirewallRule -RuleName "Expo Metro Bundler (8081)" -Port 8081 -Description "Allows Expo Go on phone to connect to Metro Bundler on port 8081"
Ensure-FirewallRule -RuleName "MineO Backend API (3001)" -Port 3001 -Description "Allows phone app to call MineO backend API on port 3001"

Write-Host ""
Write-Host "Firewall rules are ready for ports 8081 and 3001." -ForegroundColor Cyan
Write-Host "Now run backend and client, then scan the QR again." -ForegroundColor Cyan
Read-Host "Press Enter to close"
