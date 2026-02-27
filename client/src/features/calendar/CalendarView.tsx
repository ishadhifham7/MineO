// src/features/calendar/CalendarView.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import type { CalendarViewProps } from "./types";
import { colors } from "../../constants/colors";

/**
 * Pure presentational component for calendar display
 * Renders a monthly calendar with marked dates
 *
 * @param props - Calendar view properties
 */
export const CalendarView: React.FC<CalendarViewProps> = ({
  markedDates,
  selectedDate,
  onDayPress,
  onMonthChange,
  loading = false,
  currentMonth,
}) => {
  // Get today's date in ISO format to disable future dates
  const today = new Date().toISOString().split("T")[0];

  // Merge selected date styling with marked dates
  const finalMarkedDates = {
    ...markedDates,
    ...(selectedDate && {
      [selectedDate]: {
        ...(markedDates[selectedDate] || { dots: [] }),
        selected: true,
        selectedColor: colors.average,
      },
    }),
  };

  return (
    <View style={styles.container}>
      <Calendar
        current={currentMonth}
        markedDates={finalMarkedDates}
        onDayPress={onDayPress}
        onMonthChange={onMonthChange}
        maxDate={today}
        markingType="multi-dot"
        enableSwipeMonths={true}
        hideExtraDays={false}
        theme={{
          backgroundColor: colors.cream,
          calendarBackground: colors.cream,
          textSectionTitleColor: colors.textDark,
          selectedDayBackgroundColor: colors.average,
          selectedDayTextColor: "#FFFFFF",
          todayTextColor: colors.average,
          dayTextColor: colors.textDark,
          textDisabledColor: colors.textMuted,
          dotColor: colors.average,
          selectedDotColor: "#FFFFFF",
          arrowColor: colors.textDark,
          monthTextColor: colors.textDark,
          indicatorColor: colors.average,
          textDayFontFamily: "System",
          textMonthFontFamily: "System",
          textDayHeaderFontFamily: "System",
          textDayFontWeight: "400",
          textMonthFontWeight: "600",
          textDayHeaderFontWeight: "500",
          textDayFontSize: 14,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 12,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cream,
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
