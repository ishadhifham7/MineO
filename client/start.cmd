@echo off
REM Auto-detect local network IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /R "IPv4"') do (
    set IP=%%a
)
set IP=%IP: =%
if "%IP%"=="" set IP=localhost

set REACT_NATIVE_PACKAGER_HOSTNAME=%IP%
set EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

echo.
echo Starting Expo on network IP: %IP%
echo Scan the QR code with your Expo Go app
echo Make sure your phone is on the same WiFi network
echo.

npx expo start --clear --lan
