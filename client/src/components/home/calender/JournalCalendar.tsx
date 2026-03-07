import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
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

  const [showYearSelector, setShowYearSelector] = useState(false);
  const yearAnim = useState(new Animated.Value(0))[0];

  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });

  const [currentDate, setCurrentDate] = useState(
    today.toISOString().split("T")[0],
  );

  // Incremented only when the user explicitly picks a year from the picker.
  // Changing this key remounts the Calendar at the new currentDate without
  // triggering an infinite loop from onMonthChange also updating currentDate.
  const [calendarKey, setCalendarKey] = useState(0);

  // generate last 10 years
  const years = Array.from({ length: 10 }, (_, i) => today.getFullYear() - i);

  const heightInterpolate = yearAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60],
  });

  const opacityInterpolate = yearAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const toggleYearSelector = () => {
    const toValue = showYearSelector ? 0 : 1;

    setShowYearSelector(!showYearSelector);

    Animated.timing(yearAnim, {
      toValue,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

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

  const handleYearPress = (year: number) => {
    const newDate = `${year}-${String(currentMonth.month).padStart(2, "0")}-01`;

    setCurrentMonth({ year, month: currentMonth.month });
    setCurrentDate(newDate);
    // Bump the key AFTER updating currentDate so the Calendar remounts at the
    // new date. Using a separate key (not currentDate itself) prevents the
    // onMonthChange → setCurrentDate → key change → remount loop.
    setCalendarKey((k) => k + 1);

    // close selector with animation
    setShowYearSelector(false);

    Animated.timing(yearAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* YEAR SELECTOR */}
      <Animated.View
        style={{
          height: heightInterpolate,
          opacity: opacityInterpolate,
          overflow: "hidden",
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.yearContainer}
        >
          {years
            .slice()
            .reverse()
            .map((year) => {
              const isActive = year === currentMonth.year;
              return (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.yearButton,
                    isActive && styles.activeYearButton,
                  ]}
                  onPress={() => handleYearPress(year)}
                >
                  <Text
                    style={[styles.yearText, isActive && styles.activeYearText]}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </Animated.View>

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
          key={calendarKey}
          current={currentDate}
          enableSwipeMonths={true}
          markingType="dot"
          markedDates={markedDates}
          onMonthChange={(month) => {
            // Only track the current month — do NOT update currentDate here.
            // Updating currentDate would change calendarKey and cause an
            // infinite remount loop.
            setCurrentMonth({ year: month.year, month: month.month });
          }}
          onDayPress={(day) => {
            if (markedDates[day.dateString]?.marked && onMarkedDatePress) {
              onMarkedDatePress(day.dateString);
            }
          }}
          onPressArrowLeft={(subtractMonth) => subtractMonth()}
          onPressArrowRight={(addMonth) => addMonth()}
          renderHeader={(date) => {
            if (!date) return null;
            const d = new Date(date as any);
            const label = d.toLocaleString("default", {
              month: "long",
              year: "numeric",
            });

            return (
              <TouchableOpacity
                onPress={toggleYearSelector}
                style={styles.headerWrap}
              >
                <Text style={styles.headerText}>{label}</Text>
              </TouchableOpacity>
            );
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

  headerWrap: {
    alignItems: "center",
    paddingVertical: 8,
  },

  headerText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2E2A26",
  },

  yearContainer: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },

  yearButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: "#F5F5F5",
  },

  activeYearButton: {
    backgroundColor: "#7C6F5B",
  },

  yearText: {
    fontSize: 13,
    color: "#2E2A26",
    fontWeight: "500",
  },

  activeYearText: {
    color: "#FFFFFF",
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
