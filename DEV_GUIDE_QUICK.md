# MineO Development Guide

## Quick Start

### Starting the Development Environment

**Option 1: Using VS Code Tasks (Recommended)**

1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Run Task"
3. Select "Start Dev Environment"

This will start both the backend server and the Expo client in separate terminals.

**Option 2: Using PowerShell Scripts**

Start both server and client:

```powershell
.\start-dev.ps1
```

Start only the backend server:

```powershell
.\start-server.ps1
```

**Option 3: Manual Start**

Backend:

```powershell
cd server
npm run dev
```

Client:

```powershell
cd client
npm start
```

### Stopping the Development Environment

**Option 1: Using VS Code Tasks**

1. Open Command Palette (`Ctrl+Shift+P`)
2. Type "Run Task"
3. Select "Stop All Servers"

**Option 2: Using PowerShell Script**

```powershell
.\stop-dev.ps1
```

**Option 3: Manual Stop**

- Close the terminal windows
- OR run the kill-ports script:

```powershell
.\kill-ports.ps1
```

## Common Issues and Solutions

### Issue 1: Port Already in Use (EADDRINUSE)

**Symptom:**

```
Error: listen EADDRINUSE: address already in use 0.0.0.0:3001
```

**Solution:**
Run the kill-ports script to free up the ports:

```powershell
.\kill-ports.ps1
```

This will kill any processes using ports 3001 (backend) and 8081 (Expo).

### Issue 2: Network Error - No Response from Server

**Symptom:**

```
ERROR  Network Error: No response from server
```

**Root Cause:**
Your computer's IP address has changed. This happens when:

- You switch wifi networks
- Your router assigns a new IP
- You disconnect/reconnect to the network

**Solution:**

1. **Find your current IP address:**

   ```powershell
   ipconfig | Select-String "IPv4"
   ```

   Look for an address like `192.168.x.x` (your local network IP)

2. **Update the client configuration:**
   Edit `client/constants/env.ts` and update the IP address:

   ```typescript
   const API_URL =
     process.env.EXPO_PUBLIC_API_URL || "http://YOUR_IP_HERE:3001";
   ```

3. **Restart the Expo client:**
   - Stop the client (Ctrl+C in the terminal)
   - Run `npm start` again
   - The app will reload with the new IP

**Note:** The backend server automatically binds to all network interfaces (0.0.0.0), so you only need to update the client configuration.

### Issue 3: Server Doesn't Stop When VSCode Closes

**Root Cause:**
Node.js processes can continue running in the background even after VSCode closes.

**Solution:**
Always stop the servers before closing VSCode:

- Use the "Stop All Servers" task, OR
- Run `.\stop-dev.ps1`, OR
- Run `.\kill-ports.ps1`

**To clean up zombie processes:**

```powershell
# Kill all Node.js processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Then clean up the ports
.\kill-ports.ps1
```

### Issue 4: Firebase Connection Timeout

**Symptom:**
API endpoints hang or timeout, especially `/api/v1/goals`

**Root Cause:**
Firebase Firestore connection issue. The server cannot connect to Firebase.

**Solution:**

1. Check your internet connection
2. Verify Firebase credentials in `server/.env`
3. Make sure the Firebase project is active in the Firebase Console

## Development Workflow

### Recommended Workflow

1. **Starting your day:**

   ```powershell
   # Clean up any zombie processes from yesterday
   .\stop-dev.ps1

   # Start fresh
   .\start-dev.ps1
   ```

2. **During development:**
   - Backend auto-restarts on code changes (nodemon)
   - Frontend auto-reloads on code changes (Expo)
   - Check the terminal windows for errors

3. **Ending your day:**
   ```powershell
   # Stop all servers
   .\stop-dev.ps1
   ```

### Best Practices

1. **Always stop servers before closing VSCode**
   - Prevents zombie processes
   - Avoids port conflicts

2. **Check your IP address when switching networks**
   - Update `client/constants/env.ts` if needed
   - Alternatively, set `EXPO_PUBLIC_API_URL` in a `.env` file

3. **Use the provided scripts**
   - Don't manually kill processes (unless necessary)
   - Scripts handle cleanup properly

4. **Monitor the terminal output**
   - Backend logs show API requests and errors
   - Frontend logs show bundling and network errors

## Network Configuration

### Current Network IPs

Your development machine has the following network interfaces:

- **Localhost:** `127.0.0.1` (only accessible from this computer)
- **Local Network:** `192.168.1.103` (accessible from other devices on same wifi)
- **VPN/Virtual:** `172.16.0.2` (if applicable)

### Backend Server

The server binds to `0.0.0.0:3001`, which means it listens on ALL network interfaces.

You can access it at:

- http://localhost:3001 (from this computer)
- http://192.168.1.103:3001 (from your phone on same wifi)

### Client Configuration

The client needs to know where to find the server.

**For Expo Go on a physical device:**

- Must use your computer's local network IP (e.g., `192.168.1.103`)
- Device must be on the same wifi network as your computer

**For Android/iOS emulator:**

- Can use `localhost` or `127.0.0.1`
- OR use the network IP

## Available Tasks (VS Code)

- **Start Dev Environment** - Starts both backend and client
- **Start Backend Server** - Starts only the backend
- **Start Expo Client** - Starts only the client
- **Kill Ports** - Frees up ports 3001 and 8081
- **Stop All Servers** - Stops all Node.js processes and cleans ports

Access tasks via Command Palette → "Tasks: Run Task"

## API Documentation

When the backend is running, you can access the API documentation at:

- http://localhost:3001/docs

This shows all available API endpoints, request/response schemas, and allows you to test endpoints directly.

## Troubleshooting

### Server won't start

1. Check if port is already in use: `netstat -ano | findstr :3001`
2. Kill the process: `taskkill /F /PID <process_id>`
3. Or use: `.\kill-ports.ps1`

### Client can't connect to server

1. Verify server is running: `netstat -ano | findstr :3001`
2. Check IP address in `client/constants/env.ts` matches your computer's IP
3. Ensure phone and computer are on same wifi network
4. Test server is accessible: `Invoke-WebRequest http://YOUR_IP:3001/health -UseBasicParsing`

### App shows old data / doesn't update

1. Clear Expo cache: `cd client; npx expo start -c`
2. Reload app in Expo Go (shake device → Reload)

## Getting Help

If you encounter issues not covered here:

1. Check the terminal output for error messages
2. Check the server logs (backend terminal window)
3. Check the Expo logs (client terminal window)
4. Verify your network configuration
5. Try stopping all servers and starting fresh

## Scripts Reference

| Script             | Purpose                                     |
| ------------------ | ------------------------------------------- |
| `start-dev.ps1`    | Start both server and client in new windows |
| `start-server.ps1` | Start only the backend server               |
| `stop-dev.ps1`     | Stop all servers and clean up processes     |
| `kill-ports.ps1`   | Free up ports 3001 and 8081                 |

## Environment Variables

### Client (`client/constants/env.ts`)

- `EXPO_PUBLIC_API_URL` - Backend server URL (defaults to network IP)

### Server (`server/.env`)

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3001)
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_CLIENT_EMAIL` - Firebase service account email
- `FIREBASE_PRIVATE_KEY` - Firebase service account private key
- `GROQ_API_KEY` - GROQ AI API key
- `JWT_SECRET` - JWT signing secret
