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
 * Single dot entry for multi-dot marking
 */
export interface CalendarDot {
  key: string;
  color: string;
}

/**
 * Marked dates format for react-native-calendars (multi-dot mode)
 * Key: "YYYY-MM-DD" date string
 * Value: array of dots (one per journal entry, capped at 3 visually)
 */
export type MarkedDatesType = Record<
  string,
  {
    marked?: boolean;
    dots: CalendarDot[];
    selected?: boolean;
    selectedColor?: string;
  }
>;

/**
 * Journals grouped by date
 */
export type JournalsByDate = Record<string, JournalEntry[]>;

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
  currentMonth?: string;
}

/**
 * Return type for useCalendarData hook
 */
export interface UseCalendarDataReturn {
  journals: JournalEntry[];
  journalsByDate: JournalsByDate;
  markedDates: MarkedDatesType;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}
