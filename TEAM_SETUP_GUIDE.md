# 🚀 MineO - Team Setup Guide

## Quick Start for Team Members

Welcome! This guide will help you run the MineO project on your laptop in **under 5 minutes**.

### ✨ What's Special?

**No IP Address Configuration Needed!** 🎉

The app automatically detects your computer's IP address. No more hardcoding, no more manual updates, no more "network error" issues.

---

## 📋 Prerequisites

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **Git** - [Download here](https://git-scm.com/)
3. **Expo Go app** on your phone:
   - [iOS App Store](https://apps.apple.com/app/apple-store/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

---

## 🛠️ Setup Instructions

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd MineO
```

### Step 2: Install Dependencies

**Backend:**

```bash
cd server
npm install
```

**Frontend:**

```bash
cd ../client
npm install
```

### Step 3: Setup Environment Variables

**Backend (.env):**

```bash
cd server
# Create .env file (copy from .env.example if exists)
# Add your Firebase credentials and other config
```

**Frontend (.env):**

```bash
cd ../client
# The .env file is already configured!
# No need to change anything - automatic IP detection is enabled
```

### Step 4: Start the Servers

**Terminal 1 - Start Backend:**

```bash
cd server
npm run dev
```

You should see:

```
🚀 Server running on http://localhost:3001
```

**Terminal 2 - Start Frontend:**

```bash
cd client
npx expo start
```

You should see a QR code in the terminal.

### Step 5: Run on Your Phone

1. **Open Expo Go app** on your phone
2. **Make sure your phone and laptop are on the SAME WiFi network** ⚠️
3. **Scan the QR code** from the terminal
4. The app will automatically detect your laptop's IP and connect!

---

## 🔍 How Auto-Detection Works

When you run `npx expo start`, Expo automatically knows your computer's IP address on the local network. Our app reads this IP and uses it to connect to the backend server.

**Flow:**

1. Expo starts on your laptop (e.g., at 192.168.1.100:8081)
2. App detects: "My laptop is at 192.168.1.100"
3. App connects to backend at: http://192.168.1.100:3001
4. Everything works automatically! ✨

---

## 🐛 Troubleshooting

### Issue: "Network Error" when logging in

**Solution 1: Check Backend is Running**

```bash
# Run this command:
netstat -ano | findstr ":3001"   # Windows
lsof -i :3001                     # Mac/Linux

# You should see output showing port 3001 is LISTENING
# If not, start the backend server
```

**Solution 2: Check WiFi Connection**

- Make sure your phone and laptop are on the **SAME WiFi network**
- Don't use VPN on either device
- If on corporate WiFi, it might block local connections

**Solution 3: Check Console Logs**
Open the Expo app and check the logs. You should see:

```
🔍 Auto-detected IP from Expo: 192.168.1.XXX
🔧 API Service - API_BASE_URL: http://192.168.1.XXX:3001
```

If the IP looks wrong, you can manually override it (see Advanced section).

---

## 🔧 Advanced Configuration

### Manual IP Override (Only if auto-detection fails)

Edit `client/.env`:

```env
# Uncomment and set your laptop's IP:
EXPO_PUBLIC_API_URL=http://YOUR_IP_HERE:3001
```

Find your IP:

- **Windows:** Run `ipconfig` and look for "IPv4 Address"
- **Mac/Linux:** Run `ifconfig` and look for "inet"

### Using Android Emulator

The app automatically detects Android emulator and uses `10.0.2.2` (emulator's localhost alias).

If you need to override:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3001
```

### Windows Firewall

If connection fails, you might need to allow Node.js through Windows Firewall:

```powershell
# Run in PowerShell as Administrator:
New-NetFirewallRule -DisplayName "MineO Backend Dev" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
```

---

## 📱 Running on Different Devices

### Physical Phone

✅ Works automatically - just ensure same WiFi!

### Android Emulator

✅ Works automatically - uses special 10.0.2.2 IP

### iOS Simulator

✅ Works automatically - uses localhost

### Expo Go vs Development Build

✅ Both work with auto-detection

---

## 🎯 Common Development Tasks

### Clear Cache and Restart

```bash
cd client
npx expo start --clear
```

### Check Backend Logs

The backend logs all requests. Look for:

```
🔵 API Request: POST /api/v1/auth/login
```

### Update Dependencies

```bash
# Backend
cd server
npm update

# Frontend
cd client
npm update
```

---

## 👥 Team Collaboration

### When You Pull New Code

```bash
git pull
cd server && npm install
cd ../client && npm install
```

### When Backend Port Changes

If someone changes the backend port from 3001:

1. Update `server/.env` or `server/src/config/env.ts`
2. Update `client/src/services/api.ts` - change `BACKEND_PORT`
3. Commit both changes together

### Sharing Error Logs

When asking for help, share:

1. **Console logs** from the app (look for 🔧, 🔍, ❌ emojis)
2. **Backend terminal** output
3. **Your IP address** (from `ipconfig` or `ifconfig`)

---

## 🎓 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Fastify Documentation](https://www.fastify.io/)

---

## 📞 Need Help?

If you're stuck:

1. Check the troubleshooting section above
2. Look at the console logs (they're very detailed!)
3. Ask in the team chat with your error logs

---

**Happy Coding! 🎉**
