@echo off
set REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.103
set EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

echo.
echo Starting Expo on network IP: 192.168.1.103
echo Scan the QR code with your Expo Go app
echo Make sure your phone is on the same WiFi network
echo.

npx expo start --clear --lan
