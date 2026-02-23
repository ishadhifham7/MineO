// src/features/calendar/CalendarContainer.tsx
import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { CalendarView } from "./CalendarView";
import { useCalendarData } from "./useCalendarData";
import type { CalendarState } from "./types";
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

  // Fetch journal data for current month
  const { journals, markedDates, loading, error } = useCalendarData(
    calendarState.currentYear,
    calendarState.currentMonth,
  );

  /**
   * Handle date press event
   * For now: log selected journal to console
   * Future: can trigger popup/bottom sheet
   */
  const handleDayPress = useCallback(
    (day: { dateString: string }) => {
      setCalendarState((prev) => ({
        ...prev,
        selectedDate: day.dateString,
      }));

      // Find journal for selected date
      const selectedJournal = journals.find((j) => j.date === day.dateString);

      if (selectedJournal) {
        console.log("📅 Selected Journal:", selectedJournal);
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

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load calendar data</Text>
          <Text style={styles.errorDetail}>{error.message}</Text>
        </View>
      ) : (
        <CalendarView
          markedDates={markedDates}
          selectedDate={calendarState.selectedDate}
          onDayPress={handleDayPress}
          onMonthChange={handleMonthChange}
          loading={loading}
        />
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
