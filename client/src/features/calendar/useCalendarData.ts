// src/features/calendar/useCalendarData.ts
import { useState, useEffect } from "react";
import { getJournalsByRange } from "./calendar.api";
import type { JournalEntry, MarkedDatesType, UseCalendarDataReturn } from "./types";

/**
 * Custom hook to fetch and transform journal data for calendar display
 * @param year - The year to fetch journals for
 * @param month - The month to fetch journals for (1-12)
 * @returns Journal entries, marked dates, loading state, and error
 */
export const useCalendarData = (year: number, month: number): UseCalendarDataReturn => {
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [markedDates, setMarkedDates] = useState<MarkedDatesType>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        setLoading(true);
        setError(null);

        // Calculate date range for the month
        const { startDate, endDate } = getMonthDateRange(year, month);

        // Fetch journals from API
        const fetchedJournals = await getJournalsByRange(startDate, endDate);

        // Transform to marked dates format
        const marked = transformToMarkedDates(fetchedJournals);

        setJournals(fetchedJournals);
        setMarkedDates(marked);
      } catch (err) {
        console.error("Error fetching calendar journals:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch journals"));
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, [year, month]);

  return {
    journals,
    markedDates,
    loading,
    error,
  };
};

/**
 * Calculate first and last day of the month in ISO format
 * @param year - Year
 * @param month - Month (1-12)
 * @returns Object with startDate and endDate
 */
const getMonthDateRange = (year: number, month: number): { startDate: string; endDate: string } => {
  // Ensure month is zero-padded
  const monthStr = month.toString().padStart(2, "0");
  const startDate = `${year}-${monthStr}-01`;

  // Calculate last day of month
  const lastDay = new Date(year, month, 0).getDate();
  const lastDayStr = lastDay.toString().padStart(2, "0");
  const endDate = `${year}-${monthStr}-${lastDayStr}`;

  return { startDate, endDate };
};

/**
 * Transform journal entries into calendar marked dates format
 * @param journals - Array of journal entries
 * @returns Object with date keys and marking configuration
 */
const transformToMarkedDates = (journals: JournalEntry[]): MarkedDatesType => {
  const marked: MarkedDatesType = {};

  journals.forEach((journal) => {
    marked[journal.date] = {
      marked: true,
      dotColor: journal.isPinnedToTimeline ? "#FFD700" : "#6366F1", // Gold for pinned, indigo for regular
    };
  });

  return marked;
};
