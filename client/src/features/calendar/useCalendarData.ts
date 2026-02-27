// src/features/calendar/useCalendarData.ts
import { useState, useEffect, useCallback } from "react";
import { getJournalsByRange } from "./calendar.api";
import type { JournalEntry, JournalsByDate, MarkedDatesType, UseCalendarDataReturn } from "./types";

/**
 * Custom hook to fetch and transform journal data for calendar display
 * @param year - The year to fetch journals for
 * @param month - The month to fetch journals for (1-12)
 * @returns Journal entries, marked dates, loading state, error, and refetch function
 */
export const useCalendarData = (year: number, month: number): UseCalendarDataReturn => {
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [journalsByDate, setJournalsByDate] = useState<JournalsByDate>({});
  const [markedDates, setMarkedDates] = useState<MarkedDatesType>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchJournals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { startDate, endDate } = getMonthDateRange(year, month);
      console.log(`📅 Fetching calendar: ${startDate} → ${endDate}`);

      const fetchedJournals = await getJournalsByRange(startDate, endDate);
      console.log(`📅 Calendar fetched: ${fetchedJournals.length} entries`);

      const grouped = groupByDate(fetchedJournals);
      const marked = transformToMarkedDates(grouped);

      // Debug: log entry count per date
      Object.entries(grouped).forEach(([date, entries]) =>
        console.log(`📅 ${date}: ${entries.length} journal(s)`)
      );

      setJournals(fetchedJournals);
      setJournalsByDate(grouped);
      setMarkedDates(marked);
    } catch (err) {
      console.error("❌ Calendar fetch failed:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch journals"));
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchJournals();
  }, [fetchJournals]);

  return {
    journals,
    journalsByDate,
    markedDates,
    loading,
    error,
    refetch: fetchJournals,
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
 * Group journal entries by date
 */
const groupByDate = (journals: JournalEntry[]): JournalsByDate => {
  const grouped: JournalsByDate = {};
  journals.forEach((journal) => {
    if (!grouped[journal.date]) grouped[journal.date] = [];
    grouped[journal.date].push(journal);
  });
  // Sort each group newest first
  Object.values(grouped).forEach((entries) =>
    entries.sort((a, b) => b.createdAt - a.createdAt)
  );
  return grouped;
};

/**
 * Transform grouped journal entries into multi-dot calendar marking
 * Caps at 3 dots visually but stores full count
 */
const transformToMarkedDates = (grouped: JournalsByDate): MarkedDatesType => {
  const marked: MarkedDatesType = {};

  Object.entries(grouped).forEach(([date, entries]) => {
    // Cap visual dots at 3; marked:true is required by react-native-calendars to render dots
    const dots = entries.slice(0, 3).map((j) => ({
      key: j.id,
      color: j.isPinnedToTimeline ? "#FFD700" : "#6366F1",
      selectedDotColor: "#FFFFFF",
    }));
    marked[date] = { marked: true, dots };
  });

  return marked;
};
