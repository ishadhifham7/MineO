# Zombie Process Fix Documentation

## Problem

The backend server was creating "zombie" processes that wouldn't stop when terminals were closed, causing:

- Port 3001 remaining occupied
- "Network Error: No response from server" when trying to restart
- Need to manually kill processes every time

## Root Cause

On Windows, when you close a PowerShell terminal or stop nodemon:

1. SIGINT/SIGTERM signals don't always propagate properly
2. Node.js child processes can become orphaned
3. The port remains locked by the zombie process
4. New server instances can't start

## Solution Implemented

### 1. **Automatic Port Cleanup on Server Startup**

- [server/src/server.ts](server/src/server.ts#L7-L30)
- Server now automatically detects and kills any process using port 3001 before starting
- Uses Windows `netstat` and `taskkill` commands
- Waits 1 second after cleanup to ensure port is fully released

### 2. **Improved Signal Handling**

- [server/src/server.ts](server/src/server.ts#L61-L95)
- Added `SIGBREAK` signal (Windows-specific)
- Prevents duplicate shutdown attempts with `isShuttingDown` flag
- Handles `uncaughtException` and `unhandledRejection` events
- Proper Pino logger syntax for error objects

### 3. **Enhanced Startup Scripts**

- [start-server.ps1](start-server.ps1)
- Automatically checks for processes on port 3001 before starting
- Kills all conflicting processes
- Double-checks port is free before proceeding
- More robust error handling

### 4. **Nodemon Configuration**

- [server/nodemon.json](server/nodemon.json)
- Configured for Windows compatibility
- Uses `SIGTERM` signal
- Legacy watch mode enabled for better file system compatibility
- Helpful restart/crash messages

## How It Works Now

### Normal Startup Flow

1. Run `.\start-server.ps1` or `npm run dev` in server directory
2. Script checks if port 3001 is in use
3. If occupied, automatically kills the process
4. Waits for port to be fully released
5. Starts fresh server instance
6. Server binds to port 3001 successfully

### Graceful Shutdown Flow

1. Terminal closed or Ctrl+C pressed
2. Server receives shutdown signal (SIGINT, SIGTERM, or SIGBREAK)
3. `shutdown()` function called
4. Server closes all connections gracefully
5. Process exits cleanly
6. Port 3001 is released

### Zombie Process Handling

If a zombie process somehow persists:

1. Next startup detects it automatically
2. Kills the zombie process
3. Waits for clean release
4. Continues with normal startup

## Testing Performed

✅ **Test 1: Normal Startup**

- Port free → Server starts immediately
- Result: SUCCESS

✅ **Test 2: Startup with Zombie Process**

- Port occupied by PID 15092 → Auto-killed → Server started
- Result: SUCCESS

✅ **Test 3: Graceful Shutdown**

- Killed terminal → Process exited cleanly → Port released
- Result: SUCCESS

✅ **Test 4: API Accessibility**

- `/api/v1/health` → 200 OK
- `/api/v1/goals` → 200 OK with data
- Result: SUCCESS

✅ **Test 5: Restart After Shutdown**

- Stopped server → Restarted → No conflicts
- Result: SUCCESS

## Usage

### Start Server (Recommended)

```powershell
.\start-dev.ps1
```

Starts both backend and frontend with automatic cleanup.

### Start Server Only

```powershell
.\start-server.ps1
```

Starts only the backend server with automatic cleanup.

### Manual Start (Advanced)

```powershell
cd server
npm run dev
```

Includes automatic port cleanup via server code.

### Stop Server

```powershell
# Option 1: Close the terminal (now works properly!)
# Option 2: Ctrl+C in terminal
# Option 3: Use stop script
.\stop-dev.ps1
```

### Manual Cleanup (If Needed)

```powershell
.\kill-ports.ps1
```

## Files Modified

1. **server/src/server.ts**
   - Added `ensurePortFree()` function
   - Enhanced signal handling
   - Added Windows-specific signals
   - Improved error logging

2. **server/nodemon.json** (NEW)
   - Windows-compatible configuration
   - Better restart handling

3. **start-server.ps1**
   - Multi-pass port cleanup
   - More robust error handling
   - Verification steps

4. **start-dev.ps1**
   - Updated to use improved start-server.ps1
   - Better timing for startup sequence

## Benefits

✅ **No more manual process killing**
✅ **Automatic recovery from zombie processes**
✅ **Reliable server restarts**
✅ **Better error messages**
✅ **Works consistently on Windows**
✅ **Graceful shutdown when it works, auto-cleanup when it doesn't**

## Monitoring

Check server status:

```powershell
# Check if port 3001 is in use
netstat -ano | findstr :3001

# Check all Node processes
Get-Process -Name node | Format-Table
```

## Troubleshooting

### Server won't start

1. Check output - auto-cleanup should handle it
2. If still failing, run: `.\kill-ports.ps1`
3. Check if another app is using port 3001

### Still getting zombie processes

1. The server should auto-kill them on startup
2. If persistent, check Windows Task Manager for orphaned node.exe processes
3. Consider changing the port in `.env` if another service conflicts

### API not accessible

1. Verify server is running: `netstat -ano | findstr :3001`
2. Check firewall isn't blocking port 3001
3. Verify IP address in client `.env` matches: `ipconfig`

## Future Improvements

Potential enhancements (not currently needed):

- Port configuration from environment variable
- Health check before declaring server ready
- Process ID file (.pid) for tracking
- Service wrapper for Windows Services
- Docker containerization for better isolation

## Conclusion

The zombie process issue is now completely resolved with multiple layers of protection:

1. **Prevention**: Proper signal handling for clean shutdown
2. **Detection**: Check for port conflicts on startup
3. **Resolution**: Auto-kill conflicting processes
4. **Verification**: Confirm port is free before binding

You can now safely close terminals and restart the server without manual intervention! 🎉
