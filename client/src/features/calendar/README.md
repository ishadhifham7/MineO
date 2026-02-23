# Calendar Module Documentation

## 📁 Overview

A reusable Calendar module that displays a monthly calendar with dot indicators for dates that have journal entries. The module follows a clean architectural pattern separating data fetching, business logic, and presentation.

## 🏗️ Architecture

```
/src/features/calendar/
├── CalendarContainer.tsx    # Logic orchestrator
├── CalendarView.tsx         # Pure presentational component
├── useCalendarData.ts       # Data fetching & transformation hook
├── calendar.api.ts          # API service layer
├── types.ts                 # TypeScript interfaces
└── index.ts                 # Barrel exports
```

## 📊 Data Flow

```
CalendarContainer (State Management)
         ↓
useCalendarData(year, month) → API → Server → Firebase
         ↓
CalendarView (Presentation)
```

## 🎯 Features

✅ **Displays monthly calendar** with react-native-calendars  
✅ **Dot indicators** under dates with journal entries  
✅ **Efficient data fetching** - only fetches visible month  
✅ **Date selection** handling  
✅ **Month navigation** with automatic data refresh  
✅ **Color-coded dots**:
- 🔵 Blue (Indigo): Regular journal entries
- 🟡 Gold: Pinned to timeline entries  
✅ **Future date blocking** via `maxDate`  
✅ **Loading states**  
✅ **Error handling**

## 🔌 API Integration

### Server Endpoint

**GET** `/api/v1/journal/range`

**Query Parameters:**
- `startDate`: "YYYY-MM-DD"
- `endDate`: "YYYY-MM-DD"

**Response:** Array of JournalEntry objects

```typescript
[
  {
    id: string,
    date: string,
    title?: string,
    isPinnedToTimeline: boolean,
    createdAt: number,
    updatedAt: number
  }
]
```

## 💻 Usage

### Basic Integration

```tsx
import { CalendarContainer } from "@/features/calendar";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <CalendarContainer />
    </View>
  );
}
```

### Advanced Usage with Custom Handling

```tsx
import { CalendarView, useCalendarData } from "@/features/calendar";
import { useState } from "react";

export default function CustomCalendar() {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(2);
  
  const { markedDates, loading } = useCalendarData(currentYear, currentMonth);
  
  const handleDayPress = (day: { dateString: string }) => {
    // Your custom logic here
    console.log("Date pressed:", day.dateString);
  };
  
  return (
    <CalendarView
      markedDates={markedDates}
      selectedDate={null}
      onDayPress={handleDayPress}
      onMonthChange={(month) => {
        setCurrentYear(month.year);
        setCurrentMonth(month.month);
      }}
      loading={loading}
    />
  );
}
```

## 🎨 Customization

### Color Scheme

Edit [CalendarView.tsx](CalendarView.tsx#L57-L78) theme object:

```tsx
theme={{
  backgroundColor: colors.cream,
  selectedDayBackgroundColor: colors.average,
  dotColor: colors.average,
  // ... other theme properties
}}
```

### Dot Colors

Edit [useCalendarData.ts](useCalendarData.ts#L85-L88):

```tsx
marked[journal.date] = {
  marked: true,
  dotColor: journal.isPinnedToTimeline ? "#FFD700" : "#6366F1",
};
```

## 📝 Type Definitions

### JournalEntry
```typescript
interface JournalEntry {
  id: string;
  date: string; // "YYYY-MM-DD"
  title?: string;
  isPinnedToTimeline: boolean;
  createdAt: number;
  updatedAt: number;
}
```

### MarkedDatesType
```typescript
type MarkedDatesType = Record<string, {
  marked: boolean;
  dotColor: string;
  selected?: boolean;
  selectedColor?: string;
}>;
```

## 🔒 Technical Constraints

- ✅ Uses **TypeScript** strictly
- ✅ Uses **react-native-calendars** for calendar UI
- ✅ Fetches **only the visible month** (optimized)
- ✅ Uses **Firestore range queries** on backend
- ✅ **Future dates disabled** via `maxDate={today}`
- ✅ Supports **dynamic month switching**

## 🚀 Future Enhancements

The module is designed for easy extension:

1. **Bottom Sheet Integration**: Handle journal view on date press
2. **Navigation**: Navigate to journal detail screen
3. **Creating Entries**: Quick-create from calendar
4. **Multi-select**: Select multiple dates
5. **Custom Markers**: Support different marker types

### Example Future Enhancement

```tsx
const handleDayPress = (day: { dateString: string }) => {
  const journal = journals.find(j => j.date === day.dateString);
  
  if (journal) {
    // Open existing journal
    navigation.navigate('JournalDetail', { id: journal.id });
  } else {
    // Create new journal
    navigation.navigate('CreateJournal', { date: day.dateString });
  }
};
```

## 🐛 Debugging

### Enable Console Logs

The module includes debug logging:

```
📅 Selected Journal: { id, date, title, ... }
📅 No journal entry for: 2026-02-15
📆 Month changed to: 2026-3
🔵 API Request: GET /range?startDate=2026-03-01&endDate=2026-03-31
```

### Common Issues

**Calendar not showing data:**
- Check backend server is running
- Verify API_BASE_URL in [api.ts](../../services/api.ts)
- Check network requests in console

**Dates not marked:**
- Verify date format is "YYYY-MM-DD"
- Check journal entries exist in Firestore
- Inspect `markedDates` object in console

## 📦 Dependencies

```json
{
  "react-native-calendars": "^1.x.x"
}
```

## 🔗 Related Files

- [Journal Types](../journal/journal.types.ts) - Shared JournalEntry interface
- [API Service](../../services/api.ts) - Axios configuration
- [Colors](../../constants/colors.ts) - Theme colors

---

**Last Updated:** February 23, 2026  
**Version:** 1.0.0
