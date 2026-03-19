import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { CalendarContainer } from "../../src/features/calendar";

/**
 * Home Screen - Journal Calendar
 * Shows a calendar with dots on dates that have journal entries
 */
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Journal Calendar</Text>
        <Text style={styles.subtitle}>
          Dots indicate days with journal entries
        </Text>
      </View>

      <View style={styles.calendarWrapper}>
        <CalendarContainer />
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: "#6366F1" }]} />
          <Text style={styles.legendText}>Regular Entry</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: "#FFD700" }]} />
          <Text style={styles.legendText}>Pinned Entry</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#0F172A",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#E8EEF9",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#B6C6E1",
  },
  calendarWrapper: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: "#C3D0E8",
    fontWeight: "500",
  },
});
