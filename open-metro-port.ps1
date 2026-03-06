# Run this once as Administrator to allow your phone to reach Metro Bundler.
# Right-click this file → "Run with PowerShell" → accept the UAC prompt.

$ruleName = "Expo Metro Bundler (8081)"

$existing = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "✅ Firewall rule already exists: $ruleName" -ForegroundColor Green
} else {
    New-NetFirewallRule `
        -DisplayName $ruleName `
        -Direction Inbound `
        -Protocol TCP `
        -LocalPort 8081 `
        -Action Allow `
        -Profile Private,Public `
        -Description "Allows Expo Go on a phone to connect to Metro Bundler on port 8081"
    Write-Host "✅ Firewall rule added: port 8081 is now open." -ForegroundColor Green
}

Write-Host ""
Write-Host "You can now run 'npm start' in the client folder and scan the QR code." -ForegroundColor Cyan
Read-Host "Press Enter to close"
