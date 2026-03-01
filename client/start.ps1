# Auto-detect local network IP
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -match 'Wi-Fi|Wireless|Ethernet' -and $_.PrefixOrigin -ne 'WellKnown' } | Select-Object -First 1).IPAddress
if (-not $ip) { $ip = "localhost" }

$env:REACT_NATIVE_PACKAGER_HOSTNAME = $ip
$env:EXPO_DEVTOOLS_LISTEN_ADDRESS = "0.0.0.0"

# Auto-generate .env so native devices know the API IP
$envContent = "EXPO_PUBLIC_API_URL=http://${ip}:3001"
Set-Content -Path ".env" -Value $envContent -Encoding UTF8

Write-Host ""
Write-Host "[+] Starting Expo on network IP: $ip" -ForegroundColor Green
Write-Host "[+] .env set to: $envContent" -ForegroundColor Green
Write-Host "[i] Scan the QR code with your Expo Go app" -ForegroundColor Cyan
Write-Host "[!] Make sure your phone is on the same WiFi network" -ForegroundColor Yellow
Write-Host ""

& npx expo start --clear --lan
