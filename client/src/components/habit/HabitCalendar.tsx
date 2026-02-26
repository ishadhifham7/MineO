import { View, Text, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";

export default function HabitCalendar({
  category,
  data,
}: {
  category: "spiritual" | "mental" | "physical";
  data: Record<string, number | undefined>;
}) {
  // Convert habit data to marked dates format
  const markedDates = Object.entries(data).reduce((acc, [date, value]) => {
    if (value === undefined || value === null) {
      return acc;
    }

    let color = "#E0E0E0"; // Default gray
    if (value === 1) color = "#4CAF50"; // Good - green
    else if (value === 0.5) color = "#2196F3"; // Average - blue
    else if (value === 0) color = "#E53935"; // Bad - red

    acc[date] = {
      selected: true,
      selectedColor: color,
      marked: true,
      dotColor: color,
    };
    return acc;
  }, {} as any);

  return (
    <View style={styles.sectionPadding}>
      <View style={styles.card}>
        <Calendar
          markedDates={markedDates}
          theme={{
            backgroundColor: "#fff",
            calendarBackground: "#fff",
            textSectionTitleColor: "#aaa",
            selectedDayBackgroundColor: "#64B5F6",
            selectedDayTextColor: "#fff",
            todayTextColor: "#64B5F6",
            dayTextColor: "#444",
            textDisabledColor: "#d9d9d9",
            monthTextColor: "#333",
            textMonthFontWeight: "600",
            textMonthFontSize: 17,
            textDayFontSize: 14,
            textDayHeaderFontSize: 11,
            arrowColor: "#555",
          }}
          style={styles.calendar}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionPadding: {
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },
  calendar: {
    borderRadius: 10,
  },
});