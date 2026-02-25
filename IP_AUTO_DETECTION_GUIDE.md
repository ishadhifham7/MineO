# 🌐 Automatic IP Detection - Setup Guide

## Problem Solved ✅

Previously, team members had to manually update IP addresses in `.env` files every time they switched networks or worked on different machines. This caused constant "network timeout" errors and wasted development time.

**Now:** The app automatically detects your computer's IP address from Expo - no manual configuration needed!

---

## How It Works 🔧

### 1. **Auto-Detection Flow**

```
Expo Start
    ↓
Detects your local IP (e.g., 192.168.1.100)
    ↓
App reads IP from Expo's hostUri
    ↓
Configures API URL: http://192.168.1.100:3001
    ↓
✅ App connects to backend automatically
```

### 2. **Files Modified**

- ✅ `client/.env` - No hardcoded IP (left commented)
- ✅ `client/constants/env.ts` - Auto-detection logic
- ✅ `client/src/services/api.ts` - Uses auto-detected URL
- ✅ `client/src/services/auth.service.ts` - Consistent URL usage

---

## Team Setup Instructions 👥

### For New Team Members:

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd MineO
   ```

2. **Install dependencies**

   ```bash
   # Backend
   cd server
   npm install

   # Frontend
   cd ../client
   npm install
   ```

3. **Configure backend environment**

   ```bash
   # In server/.env (ask team lead for actual values)
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_PRIVATE_KEY=your-private-key
   JWT_SECRET=your-jwt-secret
   GROQ_API_KEY=your-groq-api-key
   PORT=3001
   ```

4. **Start development servers**

   ```bash
   # Terminal 1: Start backend
   cd server
   npm run dev

   # Terminal 2: Start Expo
   cd client
   npm start
   ```

5. **Connect your device**
   - Scan QR code with Expo Go (Android) or Camera (iOS)
   - **That's it!** The IP is auto-detected ✨

---

## Troubleshooting 🔧

### Issue: "Network timeout" or "Cannot reach server"

**Solution 1: Verify backend is running**

```bash
# Check if port 3001 is listening
netstat -ano | findstr ":3001"  # Windows
lsof -i :3001                    # Mac/Linux
```

**Solution 2: Check your firewall**

- Ensure port 3001 is allowed in Windows Firewall
- Temporarily disable firewall to test

**Solution 3: Verify you're on the same network**

- Phone and computer must be on the same WiFi network
- Corporate/school networks may block device communication

**Solution 4: Force a specific IP (only if auto-detection fails)**

```bash
# Find your IP
ipconfig          # Windows
ifconfig          # Mac/Linux

# In client/.env, uncomment and set:
EXPO_PUBLIC_API_URL=http://YOUR_IP:3001
```

---

### Issue: "Auto-detection shows wrong IP"

**Check Expo's detected IP:**

```bash
# When Expo starts, look for:
› Metro waiting on exp://172.27.8.137:8081
                      ^^^^^^^^^^^^^ This IP
```

**If this IP is wrong:**

1. You might have multiple network adapters
2. Disconnect from VPNs
3. Use only one WiFi/Ethernet connection

---

### Issue: Different team member's IP

**This is normal!** Each team member will have different IPs:

- Developer A: `192.168.1.100`
- Developer B: `192.168.1.105`
- Developer C: `10.0.0.50`

The auto-detection handles this automatically - no sharing of IP addresses needed!

---

## For Android Emulator 📱

Android emulator cannot access `localhost` or auto-detected IPs. Use this:

```bash
# In client/.env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3001
```

`10.0.2.2` is Android emulator's special alias for host machine's localhost.

---

## How to Verify It's Working ✅

1. **Start both servers** (backend + Expo)

2. **Check Expo logs** for auto-detection:

   ```
   LOG  🔍 Auto-detected IP from Expo: 172.27.8.137
   LOG  ✅ Auto-configured API URL: http://172.27.8.137:3001
   LOG  📡 Final API Configuration: {
     API_BASE_URL: "http://172.27.8.137:3001/api/v1",
     API_URL: "http://172.27.8.137:3001"
   }
   ```

3. **Test login** - Should connect without timeout

4. **Check network requests** - All should go to auto-detected IP

---

## Network Switching 🔄

When you switch networks (home ↔ office ↔ cafe):

1. **Stop Expo** (Ctrl+C)
2. **Restart Expo**
   ```bash
   npm start
   ```
3. **Reload app** on device (shake device → reload)
4. ✅ **New IP auto-detected!**

---

## For Deployment/Production 🚀

For production builds, you'll want to set a fixed API URL:

```bash
# In client/.env
EXPO_PUBLIC_API_URL=https://api.yourdomain.com
```

This overrides auto-detection and uses your production server.

---

## Benefits 🎉

✅ No manual IP configuration  
✅ Works on any network  
✅ Works for all team members  
✅ Saves development time  
✅ Fewer "it works on my machine" issues  
✅ Easy onboarding for new developers

---

## Questions?

If you encounter issues not covered here:

1. Check Expo console logs for errors
2. Check backend server logs
3. Verify both devices are on same network
4. Ask team lead for help

---

**Last Updated:** February 23, 2026  
**Maintained by:** Development Team
