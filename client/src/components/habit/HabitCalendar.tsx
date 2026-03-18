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
    <View style={styles.card}>
      <Calendar
        markedDates={markedDates}
        theme={{
          backgroundColor: "#FFFFFF",
          calendarBackground: "#FFFFFF",
          textSectionTitleColor: "#8C7F6A",
          selectedDayBackgroundColor: "#B5A993",
          selectedDayTextColor: "#FFFFFF",
          todayTextColor: "#8C7F6A",
          dayTextColor: "#2E2A26",
          textDisabledColor: "#D4CEC2",
          monthTextColor: "#2E2A26",
          textMonthFontWeight: "700",
          textMonthFontSize: 18,
          textDayFontSize: 14,
          textDayHeaderFontSize: 12,
          arrowColor: "#8C7F6A",
        }}
        style={styles.calendar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5DFD3",
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  calendar: {
    borderRadius: 14,
  },
});