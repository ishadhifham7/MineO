// src/features/calendar/CalendarContainer.tsx
import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { CalendarView } from "./CalendarView";
import { MomentPreviewSheet } from "./MomentPreviewSheet";
import { useCalendarData } from "./useCalendarData";
import { getLocalToday } from "../../utils/date";
import type { CalendarState, JournalEntry } from "./types";
import { colors } from "../../constants/colors";


/**
 * Calendar Container - Logic orchestrator between data and UI
 * Manages calendar state and handles user interactions
 */
export const CalendarContainer: React.FC = () => {
  const router = useRouter();

  // Initialize with current month
  const now = new Date();
  const [calendarState, setCalendarState] = useState<CalendarState>({
    currentYear: now.getFullYear(),
    currentMonth: now.getMonth() + 1, // JavaScript months are 0-indexed
    selectedDate: null,
  });

  // State for moment preview
  const [selectedJournals, setSelectedJournals] = useState<JournalEntry[]>([]);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);

  // Fetch journal data for current month
  const { journalsByDate, markedDates, loading, error, refetch } = useCalendarData(
    calendarState.currentYear,
    calendarState.currentMonth,
  );

  // Re-fetch whenever this screen gains focus (e.g. coming back from journal tab)
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  /**
   * Handle date press event
   * Detects if selected date has a journal entry
   * If yes: opens preview sheet
   * If no: does nothing
   */
  const handleDayPress = useCallback(
    (day: { dateString: string }) => {
      setCalendarState((prev) => ({
        ...prev,
        selectedDate: day.dateString,
      }));

      // Find journals for selected date — only show the latest 1 entry
      const allEntries = journalsByDate[day.dateString] ?? [];
      const entries = allEntries.slice(0, 1);

      if (entries.length > 0) {
        console.log(`📅 Journal entry found for:`, day.dateString);
        setSelectedJournals(entries);
        setIsPreviewVisible(true);
      } else if (day.dateString === getLocalToday()) {
        // Today with no entry → just switch to the journal tab (its index already shows today)
        console.log("📅 Today tapped — switching to journal tab");
        router.push("/tabs/journal" as any);
      } else {
        // Past/future day with no entry — open root-level editor so back returns here
        console.log("📅 No journal entry for:", day.dateString, "— opening editor");
        router.push(`/journal/${day.dateString}` as any);
      }
    },
    [journalsByDate],
  );

  /**
   * Handle month change event
   * Triggers new data fetch for the selected month
   */
  const handleMonthChange = useCallback((month: { year: number; month: number }) => {
    console.log(`📆 Month changed to: ${month.year}-${month.month}`);
    setCalendarState({
      currentYear: month.year,
      currentMonth: month.month,
      selectedDate: null, // Reset selection on month change
    });
  }, []);

  /**
   * Handle preview sheet close
   */
  const handlePreviewClose = useCallback(() => {
    setIsPreviewVisible(false);
    setSelectedJournals([]);
  }, []);

  /**
   * Handle "View Full Moment" button press — navigate to journal date view
   */
  const handleViewFull = useCallback(
    (journalId: string) => {
      // Find the date for this journal id
      const date = Object.keys(journalsByDate).find((d) =>
        journalsByDate[d].some((j) => j.id === journalId),
      );
      if (date) {
        handlePreviewClose();
        router.push(`/journal/${date}` as any);
      }
    },
    [journalsByDate, router, handlePreviewClose],
  );

  // Format current month for calendar (YYYY-MM-DD format)
  const currentMonthString = `${calendarState.currentYear}-${String(calendarState.currentMonth).padStart(2, '0')}-01`;

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load calendar data</Text>
          <Text style={styles.errorDetail}>{error.message}</Text>
        </View>
      ) : (
        <>
          <CalendarView
            markedDates={markedDates}
            selectedDate={calendarState.selectedDate}
            onDayPress={handleDayPress}
            onMonthChange={handleMonthChange}
            loading={loading}
            currentMonth={currentMonthString}
          />

          <MomentPreviewSheet
            visible={isPreviewVisible}
            journals={selectedJournals}
            onClose={handlePreviewClose}
            onViewFull={handleViewFull}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: colors.cream,
    borderRadius: 12,
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.bad,
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
  },
});
