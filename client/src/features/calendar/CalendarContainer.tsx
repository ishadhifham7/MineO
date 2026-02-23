// src/features/calendar/CalendarContainer.tsx
import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);

  // Fetch journal data for current month
  const { journals, markedDates, loading, error } = useCalendarData(
    calendarState.currentYear,
    calendarState.currentMonth,
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

      // Find journal for selected date
      const journal = journals.find((j) => j.date === day.dateString);

      if (journal) {
        console.log("📅 Journal found for:", day.dateString);
        setSelectedJournal(journal);
        setIsPreviewVisible(true);
      } else {
        console.log("📅 No journal entry for:", day.dateString);
      }
    },
    [journals],
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
    setSelectedJournal(null);
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

  return (
    <GestureHandlerRootView style={styles.container}>
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
          />

          <MomentPreviewSheet
            visible={isPreviewVisible}
            journal={selectedJournal}
            onClose={handlePreviewClose}
            onViewFull={handleViewFull}
          />
        </>
      )}
    </GestureHandlerRootView>
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
