import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function HabitCalendar({
  category,
  data,
}: {
  category: "spiritual" | "mental" | "physical";
  data: Record<string, number>;
}) {
  // Get current month info
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  
  // Calculate days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  // Generate all days array
  const allDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Format date as YYYY-MM-DD
  const formatDate = (day: number) => {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
  };
  
  // Get background color for a day based on habit data
  const getDayColor = (day: number) => {
    const dateKey = formatDate(day);
    const value = data[dateKey];
    
    if (value === undefined) return undefined; // No data - no background
    if (value === 1) return "#4CAF50"; // Good - green
    if (value === 0.5) return "#2196F3"; // Average - blue
    return "#E53935"; // Bad - red
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonth = `${monthNames[month]} ${year}`;

  return (
    <View style={styles.sectionPadding}>
      <View style={styles.card}>
        {/* Month navigation */}
        <View style={styles.calendarNav}>
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={22} color="#555" />
          </TouchableOpacity>
          <Text style={styles.monthText}>{currentMonth}</Text>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={22} color="#555" />
          </TouchableOpacity>
        </View>

        {/* Day headers */}
        <View style={styles.dayHeaderRow}>
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
            <Text key={d} style={styles.dayHeader}>{d}</Text>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={styles.calGrid}>
          {/* Offset empty cells */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <View key={`e${i}`} style={styles.calCell} />
          ))}
          
          {/* Actual days */}
          {allDays.map((day) => {
            const isSelected = selectedDate === day;
            const dayColor = getDayColor(day);
            const hasData = dayColor !== undefined;
            
            return (
              <TouchableOpacity
                key={day}
                style={styles.calCell}
                onPress={() => setSelectedDate(day)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.calDayCircle,
                    isSelected && styles.calDaySelected,
                    hasData && !isSelected && { backgroundColor: dayColor },
                  ]}
                >
                  <Text
                    style={[
                      styles.calDayText,
                      (isSelected || hasData) && styles.calDayTextSelected,
                    ]}
                  >
                    {day}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
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
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  calendarNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
  },
  dayHeaderRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  dayHeader: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    color: "#aaa",
    letterSpacing: 0.5,
  },
  calGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calCell: {
    width: `${100 / 7}%` as any,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 3,
  },
  calDayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  calDaySelected: {
    backgroundColor: "#64B5F6",
  },
  calDayText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
  },
  calDayTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
});