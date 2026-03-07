// src/features/calendar/calendar.api.ts
import { api } from "../../services/api";
import type { JournalEntry } from "./types";

/**
 * Fetch journals within a date range
 * @param startDate - ISO format "YYYY-MM-DD"
 * @param endDate - ISO format "YYYY-MM-DD"
 * @returns Array of journal entries
 */
export const getJournalsByRange = async (
  startDate: string,
  endDate: string,
): Promise<JournalEntry[]> => {
  console.log("🌐 API Call: getJournalsByRange");
  console.log("🌐 Start date:", startDate);
  console.log("🌐 End date:", endDate);
  
  try {
    const res = await api.get(`/range?startDate=${startDate}&endDate=${endDate}`);
    console.log("✅ API Response received:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ API Error:", error.message);
    console.error("❌ Error details:", error.response?.data);
    throw error;
  }
};
