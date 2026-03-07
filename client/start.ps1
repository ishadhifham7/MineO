# Auto-detect the Wi-Fi IP (avoids stale hardcoded IPs after DHCP renewals)
$ip = node -e "
  const os = require('os');
  const ifaces = os.networkInterfaces();
  const skip = ['virtualbox','vmware','vethernet','hyper-v','wsl','loopback','vpn','tap'];
  for (const [name, addrs] of Object.entries(ifaces)) {
    const lower = name.toLowerCase();
    if (skip.some(s => lower.includes(s))) continue;
    for (const a of addrs) {
      if (a.family === 'IPv4' && !a.internal &&
          (lower.includes('wi-fi') || lower.includes('wlan') || lower.includes('wireless'))) {
        process.stdout.write(a.address); process.exit(0);
      }
    }
  }
  // fallback to first non-loopback
  for (const addrs of Object.values(ifaces)) {
    for (const a of addrs) { if (a.family==='IPv4'&&!a.internal){process.stdout.write(a.address);process.exit(0);} }
  }
"

$env:REACT_NATIVE_PACKAGER_HOSTNAME = $ip
$env:EXPO_DEVTOOLS_LISTEN_ADDRESS = "0.0.0.0"

Write-Host ""
Write-Host "📱 Starting Expo on network IP: $ip" -ForegroundColor Green
Write-Host "🎯 Scan the QR code with your Expo Go app" -ForegroundColor Cyan
Write-Host "📍 Make sure your phone is on the same WiFi network" -ForegroundColor Yellow
Write-Host ""

& npx expo start --clear --lan
