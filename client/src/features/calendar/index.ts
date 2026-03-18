// src/features/calendar/index.ts

/**
 * Calendar Module - Barrel Export
 * 
 * Provides a reusable calendar component that displays journal entries
 * with dot indicators.
 */

export { CalendarContainer } from "./CalendarContainer";
export { CalendarView } from "./CalendarView";
export { MomentPreviewSheet } from "./MomentPreviewSheet";
export { useCalendarData } from "./useCalendarData";
export * from "./types";
export * from "./calendar.api";
