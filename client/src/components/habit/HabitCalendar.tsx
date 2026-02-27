import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/colors";

const backgrounds = {
  spiritual: ["#8B5CF6", "#6366F1"] as [string, string],
  mental: ["#3B82F6", "#06B6D4"] as [string, string],
  physical: ["#F59E0B", "#EF4444"] as [string, string],
};

const monthLabel = () => {
  const d = new Date();
  return d.toLocaleString("default", { month: "long", year: "numeric" });
};

export default function HabitCalendar({
  category,
  data,
}: {
  category: string;
  data: Record<string, number>;
}) {
  const gradientColors = backgrounds[category as keyof typeof backgrounds] ?? backgrounds.spiritual;
  const entries = Object.entries(data);

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.monthLabel}>{monthLabel()}</Text>

        {entries.length === 0 ? (
          <Text style={styles.emptyText}>No habit data recorded yet.</Text>
        ) : (
          <View style={styles.dotGrid}>
            {entries.map(([date, score]) => {
              const dotColor = score === 1 ? colors.good : score === 0.5 ? colors.average : colors.bad;
              return (
                <View key={date} style={[styles.dot, { backgroundColor: dotColor }]}>
                  <Text style={styles.dotText}>{date.split("-")[2]}</Text>
                </View>
              );
            })}
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  gradient: {
    borderRadius: 20,
    padding: 16,
    minHeight: 120,
  },
  monthLabel: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 12,
  },
  emptyText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    textAlign: "center",
    marginTop: 16,
  },
  dotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dotText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
});
