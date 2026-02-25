import { httpClient } from "../lib/http";
import type { CalendarData, RadarApiResponse, Category } from "../features/habit/habit.types";

/**
 * Get calendar data for all habits
 */
export async function getCalendar(): Promise<CalendarData> {
  // Get current month in YYYY-MM format
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const response = await httpClient.get("/habits/calendar", {
    params: { month }
  });
  return response.data;
}

/**
 * Get radar data (7-day summary) for all categories
 */
export async function getRadar(): Promise<RadarApiResponse> {
  // Get last 7 days
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 6);
  
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const response = await httpClient.get("/habits/radar", {
    params: {
      start: formatDate(start),
      end: formatDate(end)
    }
  });
  return response.data;
}

/**
 * Update a daily habit score
 * @param date - Date string in YYYY-MM-DD format
 * @param category - Habit category (spiritual, mental, physical)
 * @param value - Score value (0, 0.5, or 1)
 */
export async function patchDailyHabit(
  date: string,
  category: Category,
  value: number
): Promise<void> {
  await httpClient.patch(`/habits/daily/${date}`, {
    category,
    value,
  });
}
