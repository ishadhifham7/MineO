import { View, Text, StyleSheet } from "react-native";
import { RadarChart } from "react-native-gifted-charts";
import { RadarData } from "../../features/habit/habit.types";

export default function HabitRadarChart({ data }: { data: RadarData }) {
  // RadarChart needs at least 3 values to render
  const hasData = data.values.length >= 3;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Growth Tracker</Text>
      {hasData ? (
        <RadarChart
          data={data.values}
          labels={data.labels}
          maxValue={100}
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Log habits to see your spider chart</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 16,
    color: "#2E2A26",
  },
  placeholder: {
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    width: "100%",
  },
  placeholderText: {
    color: "#6B645C",
    fontSize: 14,
    textAlign: "center",
  },
});
