import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { Calendar } from "react-native-calendars";
import { getJournalDates } from "../../../features/journal/journal.api";

interface MarkedDates {
  [date: string]: {
    marked: boolean;
    dotColor?: string;
  };
}

interface JournalCalendarProps {
  userId: string;
  onMarkedDatePress?: (date: string) => void;
}

const DOT_COLOR = "#7C6F5B";

export default function JournalCalendar({
  userId,
  onMarkedDatePress,
}: JournalCalendarProps) {
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDates = useCallback(async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      setError(null);
      const dates = await getJournalDates();
      const marked: MarkedDates = {};
      dates.forEach((date) => {
        marked[date] = { marked: true, dotColor: DOT_COLOR };
      });
      setMarkedDates(marked);
    } catch (err) {
      setError("Could not load journal dates.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDates();
  }, [fetchDates]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={DOT_COLOR} />
        </View>
      ) : error ? (
        <View style={styles.loadingWrap}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <Calendar
          markingType="dot"
          markedDates={markedDates}
          onDayPress={(day) => {
            if (markedDates[day.dateString]?.marked && onMarkedDatePress) {
              onMarkedDatePress(day.dateString);
            }
          }}
          theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#9CA3AF",
            selectedDayBackgroundColor: "#7C6F5B",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#7C6F5B",
            dayTextColor: "#2E2A26",
            textDisabledColor: "#d9e1e8",
            dotColor: DOT_COLOR,
            selectedDotColor: "#ffffff",
            arrowColor: "#7C6F5B",
            monthTextColor: "#2E2A26",
            textDayFontSize: 13,
            textMonthFontSize: 14,
            textDayHeaderFontSize: 11,
            textDayFontWeight: "400",
            textMonthFontWeight: "600",
          }}
          style={styles.calendar}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
  },
  calendar: {
    borderRadius: 16,
  },
  loadingWrap: {
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "#E53935",
    fontSize: 13,
  },
});
