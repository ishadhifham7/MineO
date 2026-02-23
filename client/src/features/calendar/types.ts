// src/features/calendar/types.ts

/**
 * Journal entry structure for calendar display
 * Lightweight version without blocks
 */
export interface JournalEntry {
  id: string;
  date: string; // ISO format "YYYY-MM-DD"
  title?: string;
  isPinnedToTimeline: boolean;
  createdAt: number;
  updatedAt: number;
  summary?: string; // Preview text generated from first text block
}

/**
 * Marked dates format for react-native-calendars
 * Key: "YYYY-MM-DD" date string
 * Value: marking configuration
 */
export type MarkedDatesType = Record<
  string,
  {
    marked: boolean;
    dotColor: string;
    selected?: boolean;
    selectedColor?: string;
  }
>;

/**
 * Calendar state interface
 */
export interface CalendarState {
  currentYear: number;
  currentMonth: number; // 1-12
  selectedDate: string | null; // "YYYY-MM-DD" or null
}

/**
 * Props for CalendarView component
 */
export interface CalendarViewProps {
  markedDates: MarkedDatesType;
  selectedDate: string | null;
  onDayPress: (day: { dateString: string }) => void;
  onMonthChange: (month: { year: number; month: number }) => void;
  loading?: boolean;
}

/**
 * Return type for useCalendarData hook
 */
export interface UseCalendarDataReturn {
  journals: JournalEntry[];
  markedDates: MarkedDatesType;
  loading: boolean;
  error: Error | null;
}
