import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";

export default function HabitStatusCard({
  title,
  onSelect,
}: {
  title: string;
  onSelect: (value: number) => void;
}) {
  const options = [
    { label: "Good", value: 1, color: colors.good },
    { label: "Average", value: 0.5, color: colors.average },
    { label: "Bad", value: 0, color: colors.bad },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title.charAt(0).toUpperCase() + title.slice(1)}</Text>
      <View style={styles.row}>
        {options.map((s) => (
          <Pressable
            key={s.label}
            style={[styles.dot, { backgroundColor: s.color }]}
            onPress={() => onSelect(s.value)}
          >
            <Text style={styles.dotLabel}>{s.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 12,
    color: "#222",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dot: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  dotLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
