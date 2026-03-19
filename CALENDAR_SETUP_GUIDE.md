# 📅 Calendar Working Prototype - Setup Guide

## ✅ What's Been Fixed

1. **Port Configuration** - Server now runs on port 3001
2. **Full UI Restored** - All original UI elements are back
3. **Working Calendar** - Shows dots on dates with journal entries
   - 🔵 Blue dot = Regular journal entry
   - 🟡 Gold dot = Pinned journal entry

## 🚀 How to Run the Prototype

### Option 1: Use the Start Script (Recommended)
```powershell
# From the root directory E:\MineO\MineO
.\start-dev.ps1
```

This will:
- Kill any processes on ports 3001 and 8081
- Start the backend server on port 3001
- Start the Expo client

### Option 2: Manual Start

#### Terminal 1 - Start Server
```powershell
cd E:\MineO\MineO\server
npm run dev
```
You should see: `🚀 Server running on http://localhost:3001`

#### Terminal 2 - Start Client
```powershell
cd E:\MineO\MineO\client
npm start
```

## 🧪 Testing the Calendar

### Step 1: Create a Journal Entry
1. Open the app on your device/emulator
2. Go to the **Journal** tab
3. Create a journal entry for today or any date
4. Add some text content
5. Save the entry

### Step 2: View on Calendar
1. Go to the **Home** tab
2. Scroll down to the calendar
3. You should see a **blue dot** on dates with journal entries
4. **Tap any date with a dot** to preview that journal entry
5. A bottom sheet will appear showing:
   - Journal title
   - Summary (first 120 characters)
   - "View Full Moment" button

### Step 3: Pin an Entry
1. Go back to the Journal entry
2. Toggle the "Pin to Timeline" option
3. Return to the Home calendar
4. That date should now show a **gold dot** instead of blue

## 📡 API Endpoints Being Used

The calendar uses this endpoint:
```
GET http://10.31.23.152:3001/api/v1/journal/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```

## 🔍 Troubleshooting

### Calendar shows no dots
- **Check:** Are there journal entries in the database?
- **Check:** Is the server running on port 3001?
- **Check:** Look at the console logs in Expo for API errors

### Server won't start on port 3001
```powershell
# Kill the port manually
.\kill-ports.ps1
```

### Client can't connect to server
- **Check:** The IP address in `client/constants/env.ts`
- **Current:** `http://10.31.23.152:3001`
- **Update if needed:** Change to your machine's local IP

## 📱 What the Home Screen Now Shows

1. **Scenic Header** - Trees, hills, clouds
2. **Search Bar** - Search moments
3. **📅 Calendar** - Shows journal entry dots (THIS IS THE WORKING PROTOTYPE)
4. **Life Moments** - Placeholder for photo moments
5. **Daily Wins** - Today's achievements
6. **Win Tracker** - Monthly statistics donut chart
7. **Goal Path** - Milestones tracker

## 🎯 Next Steps

The calendar is now fully functional! When you create journal entries, they will automatically appear as colored dots on the calendar. Tap any dot to preview the journal entry.

Need to customize anything? Let me know!
