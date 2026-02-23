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
  const res = await api.get(`/range?startDate=${startDate}&endDate=${endDate}`);
  return res.data;
};
