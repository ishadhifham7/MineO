$env:REACT_NATIVE_PACKAGER_HOSTNAME = "192.168.1.103"
$env:EXPO_DEVTOOLS_LISTEN_ADDRESS = "0.0.0.0"

Write-Host ""
Write-Host "📱 Starting Expo on network IP: 192.168.1.103" -ForegroundColor Green
Write-Host "🎯 Scan the QR code with your Expo Go app" -ForegroundColor Cyan
Write-Host "📍 Make sure your phone is on the same WiFi network" -ForegroundColor Yellow
Write-Host ""

& npx expo start --clear --lan
