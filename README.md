# MineO - Personal Growth & Productivity Platform

A full-stack mobile app for personal growth, goal tracking, journaling, and habit building.

## Quick Start

### First Time Setup

1. **Install Dependencies**

   ```powershell
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

2. **Configure Environment**
   - Server is pre-configured with `.env` file
   - Client IP address is set to `192.168.1.103:3001`
   - If your IP changes, update `client/constants/env.ts`

3. **Start Development**
   ```powershell
   # From root directory
   .\start-dev.ps1
   ```

## Common Commands

| Command              | Description                |
| -------------------- | -------------------------- |
| `.\start-dev.ps1`    | Start both server & client |
| `.\start-server.ps1` | Start only backend server  |
| `.\stop-dev.ps1`     | Stop all servers           |
| `.\kill-ports.ps1`   | Free up ports (if error)   |

## Important: Network Configuration

The client needs to connect to your computer's local IP address.

**Current IP:** `192.168.1.103` (update if changed)

**When to update:**

- You switch wifi networks
- Connection errors appear
- After restarting your router

**How to update:**

1. Find your IP: `ipconfig | Select-String "IPv4"`
2. Edit: `client/constants/env.ts`
3. Update the IP address in the `API_URL` variable
4. Restart the client

## Troubleshooting

### Port Already in Use

```powershell
.\kill-ports.ps1
```

### Network Error / Can't Connect

1. Check your IP: `ipconfig`
2. Update `client/constants/env.ts`
3. Restart client

### Server Won't Stop

```powershell
.\stop-dev.ps1
```

## Documentation

- **[Development Guide](./DEV_GUIDE_QUICK.md)** - Detailed setup & troubleshooting
- **[Server README](./server/README.md)** - Backend documentation
- **API Docs** - http://localhost:3001/docs (when server running)

## Tech Stack

- **Frontend:** React Native (Expo), TypeScript, Redux, TailwindCSS
- **Backend:** Fastify, TypeScript, Firebase (Firestore), GROQ AI
- **Mobile:** Android & iOS via Expo Go

## Project Structure

```
MineO/
├── client/           # React Native mobile app
├── server/           # Fastify backend API
├── start-dev.ps1     # Start both server & client
├── start-server.ps1  # Start server only
├── stop-dev.ps1      # Stop all servers
├── kill-ports.ps1    # Free up ports
└── DEV_GUIDE_QUICK.md # Detailed guide
```

## Development Workflow

1. Start: `.\start-dev.ps1`
2. Code (auto-reload enabled)
3. Test on device via Expo Go
4. Stop: `.\stop-dev.ps1`

**Always stop servers before closing VSCode to prevent zombie processes!**

## Getting Help

See [DEV_GUIDE_QUICK.md](./DEV_GUIDE_QUICK.md) for:

- Common issues & solutions
- Network configuration
- VS Code tasks
- Best practices
