// src/features/calendar/CalendarView.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import type { CalendarViewProps } from "./types";
import { colors } from "../../constants/colors";

/* ── Warm palette ────────────────────────────── */
const ACCENT = "#C4956A"; // warm amber / caramel
const ACCENT_LIGHT = "#F5E6D3"; // soft peach
const TODAY_RING = "#D4A574"; // warm gold-brown ring
const CREAM = "#FFFAF4"; // warm off-white
const CARD_BG = "#FFFFFF";
const TEXT_PRIMARY = "#2E2A26";
const TEXT_SECONDARY = "#8A7F72";
const TEXT_DISABLED = "#D5CFC6";
const DOT_DEFAULT = "#C4956A";
const DOT_PINNED = "#E6A817";
const ARROW_COLOR = "#9A8E80";
const DAY_HEADER = "#A89C8E";
const BORDER_COLOR = "rgba(0,0,0,0.04)";

/**
 * Pure presentational component for calendar display
 * Renders a monthly calendar with marked dates
 */
export const CalendarView: React.FC<CalendarViewProps> = ({
  markedDates,
  selectedDate,
  onDayPress,
  onMonthChange,
  loading = false,
  currentMonth,
}) => {
  // Get today's date in local timezone
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local tz

  // Merge selected date styling with marked dates
  const finalMarkedDates = {
    ...markedDates,
    ...(selectedDate && {
      [selectedDate]: {
        ...(markedDates[selectedDate] || { dots: [] }),
        selected: true,
        selectedColor: ACCENT,
      },
    }),
  };

  return (
    <View style={styles.container}>
      {/* Section label */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Journey</Text>
        <Text style={styles.sectionSub}>Tap a day to explore</Text>
      </View>

      <Calendar
        current={currentMonth}
        markedDates={finalMarkedDates}
        onDayPress={onDayPress}
        onMonthChange={onMonthChange}
        maxDate={today}
        markingType="multi-dot"
        enableSwipeMonths={true}
        hideExtraDays={true}
        theme={
          {
            backgroundColor: "transparent",
            calendarBackground: "transparent",

            /* ── Month header ── */
            monthTextColor: TEXT_PRIMARY,
            textMonthFontSize: 18,
            textMonthFontWeight: "700",
            textMonthFontFamily: "System",

            /* ── Day header (Mon Tue…) ── */
            textSectionTitleColor: DAY_HEADER,
            textDayHeaderFontSize: 12,
            textDayHeaderFontWeight: "600",
            textDayHeaderFontFamily: "System",

            /* ── Day numbers ── */
            dayTextColor: TEXT_PRIMARY,
            textDayFontSize: 15,
            textDayFontWeight: "500",
            textDayFontFamily: "System",

            /* ── Today ── */
            todayTextColor: ACCENT,
            todayBackgroundColor: ACCENT_LIGHT,

            /* ── Selected day ── */
            selectedDayBackgroundColor: ACCENT,
            selectedDayTextColor: "#FFFFFF",

            /* ── Disabled (future) ── */
            textDisabledColor: TEXT_DISABLED,

            /* ── Dots ── */
            dotColor: DOT_DEFAULT,
            selectedDotColor: "#FFFFFF",

            /* ── Arrows ── */
            arrowColor: ARROW_COLOR,

            /* ── Indicator (loading) ── */
            indicatorColor: ACCENT,

            /* ── Spacing ── */
            "stylesheet.calendar.header": {
              header: {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 8,
                paddingHorizontal: 4,
              },
              monthText: {
                fontSize: 18,
                fontWeight: "700",
                color: TEXT_PRIMARY,
              },
              dayHeader: {
                marginTop: 4,
                marginBottom: 8,
                width: 36,
                textAlign: "center",
                fontSize: 12,
                fontWeight: "600",
                color: DAY_HEADER,
                textTransform: "uppercase",
              },
              arrow: {
                padding: 8,
              },
            },
            "stylesheet.day.multiDot": {
              base: {
                width: 36,
                height: 36,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 18,
              },
              today: {
                backgroundColor: ACCENT_LIGHT,
                borderRadius: 18,
              },
              selected: {
                backgroundColor: ACCENT,
                borderRadius: 18,
              },
            },
          } as any
        }
        style={styles.calendar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: 12,
    // Soft shadow
    shadowColor: "#8A7F72",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    // Subtle border
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    // Fixed height to prevent layout shifts
    minHeight: 420,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    letterSpacing: -0.3,
  },
  sectionSub: {
    fontSize: 12,
    fontWeight: "500",
    color: TEXT_SECONDARY,
  },
  calendar: {
    // Remove default padding from react-native-calendars
    paddingLeft: 0,
    paddingRight: 0,
  },
});
