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
          <Text style={styles.buttonText}>Get Started -></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 30 },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: {
    fontSize: 42,
    fontWeight: "300",
    marginBottom: 40,
    fontFamily: "serif",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#FFFFFF",
    lineHeight: 24,
  },
  footer: { marginBottom: 40 },
  progressContainer: { flexDirection: "row", gap: 8, marginBottom: 20 },
  progressBar: { height: 2, flex: 1, backgroundColor: "#232326" },
  activeBar: { backgroundColor: "#22C55E" },
  button: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: { color: "#000000", fontSize: 16, fontWeight: "500" },

  headerText: { fontSize: 24, fontWeight: "bold", alignSelf: "flex-start" },
  subHeaderText: {
    fontSize: 16,
    color: "#A1A1AA",
    alignSelf: "flex-start",
    marginBottom: 30,
  },
});

