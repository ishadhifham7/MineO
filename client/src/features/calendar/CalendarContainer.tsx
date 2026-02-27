// src/features/calendar/CalendarContainer.tsx
import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import { CalendarView } from "./CalendarView";
import { MomentPreviewSheet } from "./MomentPreviewSheet";
import { useCalendarData } from "./useCalendarData";
import type { CalendarState, JournalEntry } from "./types";
import { colors } from "../../constants/colors";


/**
 * Calendar Container - Logic orchestrator between data and UI
 * Manages calendar state and handles user interactions
 */
export const CalendarContainer: React.FC = () => {
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

      // Find all journals for selected date (already sorted newest-first)
      const entries = journalsByDate[day.dateString] ?? [];

      if (entries.length > 0) {
        console.log(`📅 ${entries.length} journal(s) found for:`, day.dateString);
        setSelectedJournals(entries);
        setIsPreviewVisible(true);
      } else {
        console.log("📅 No journal entry for:", day.dateString);
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
   * Handle "View Full Moment" button press
   * For now: logs to console
   * Future: will emit navigation event
   */
  const handleViewFull = useCallback((journalId: string) => {
    console.log("🚀 Navigate to journal:", journalId);
    // TODO: Emit event or call navigation callback
    // This will be implemented in the next layer
  }, []);

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
