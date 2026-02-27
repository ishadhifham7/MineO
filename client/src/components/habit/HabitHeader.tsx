import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";

const categories = ["spiritual", "mental", "physical"] as const;

export default function HabitHeader({
  active,
  onChange,
}: {
  active: string;
  onChange: (v: any) => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.titleBadge}>
        <Text style={styles.titleText}>Habit Tracker</Text>
      </View>

      <View style={styles.tabRow}>
        {categories.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => onChange(cat)}
            style={[
              styles.tab,
              { backgroundColor: active === cat ? colors.textDark : colors.cream },
            ]}
          >
            <Text style={{ color: active === cat ? "#fff" : colors.textMuted, fontWeight: "500" }}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 8,
  },
  titleBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 16,
  },
  titleText: {
    fontWeight: "600",
    fontSize: 16,
  },
  tabRow: {
    flexDirection: "row",
    gap: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
});
