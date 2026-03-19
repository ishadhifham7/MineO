import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Step4() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerText}>Begin</Text>
        <Text style={styles.subHeaderText}>
          Small reflection builds long-term clarity
        </Text>
        <Text style={styles.description}>
          Progress does not need to be loud. Start with one moment, one habit,
          one goal.
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, styles.activeBar]} />
          <View style={[styles.progressBar, styles.activeBar]} />
          <View style={[styles.progressBar, styles.activeBar]} />
          <View style={[styles.progressBar, styles.activeBar]} />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/tabs")}
        >
          <Text style={styles.buttonText}>Get Started →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220", padding: 30 },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },

  headerText: { fontSize: 24, fontWeight: "bold", alignSelf: "flex-start" },
  subHeaderText: { fontSize: 16, color: "#B6C6E1", alignSelf: "flex-start", marginBottom: 30 },

  description: { fontSize: 16, textAlign: "center", color: "#CFDBEF", lineHeight: 24 },

  footer: { marginBottom: 40 },
  progressContainer: { flexDirection: "row", gap: 8, marginBottom: 20 },
  progressBar: { height: 2, flex: 1, backgroundColor: "#23324D" },
  activeBar: { backgroundColor: "#111A2E" },

  button: {
    backgroundColor: "#111A2E",
    padding: 18, // ✅ FIXED HERE
    borderRadius: 4,
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontSize: 16, fontWeight: "500" }
});