// src/features/calendar/calendar.api.ts
import { api } from "../../services/api";
import type { JournalEntry } from "./types";

/**
 * Fetch journals within a date range.
 * The server no longer has a dedicated /range endpoint, so we use /dates
 * to get all journal dates for the user and then fetch entries per date
 * that falls within the requested range.
 */
export const getJournalsByRange = async (
  startDate: string,
  endDate: string,
): Promise<JournalEntry[]> => {
  console.log("🌐 API Call: getJournalsByRange");
  console.log("🌐 Start date:", startDate);
  console.log("🌐 End date:", endDate);

  try {
    // 1. Get all dates that have journal entries
    const datesRes = await api.get<{ dates: string[] }>("/dates");
    const allDates: string[] = datesRes.data.dates ?? datesRes.data ?? [];

    // 2. Filter to dates within the requested range
    const datesInRange = allDates.filter((d) => d >= startDate && d <= endDate);

    if (datesInRange.length === 0) {
      console.log("📅 No journal dates in range");
      return [];
    }

    // 3. Fetch entries for each date in the range
    const results = await Promise.all(
      datesInRange.map(async (date) => {
        const res = await api.get<JournalEntry[]>(`/all-by-date?date=${date}`);
        return Array.isArray(res.data) ? res.data : [];
      }),
    );

    const entries = results.flat();
    console.log(`✅ Calendar: ${entries.length} entries in range`);
    return entries;
  } catch (error: any) {
    console.error("❌ API Error:", error.message);
    console.error("❌ Error details:", error.response?.data);
    throw error;
  }
};
