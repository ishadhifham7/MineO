import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Step3() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerText}>Memory as Foundation</Text>
        <Text style={styles.subHeaderText}>Your journey shapes you</Text>

        <View style={styles.timeline}>
          <View style={styles.line} />
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === 4 && styles.activeDot
              ]}
            />
          ))}
        </View>

        <Text style={styles.description}>
          Life moments - both challenging and meaningful - form your personal narrative.
          Reflection helps you understand where you've been and where you're heading.
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, styles.activeBar]} />
          <View style={[styles.progressBar, styles.activeBar]} />
          <View style={[styles.progressBar, styles.activeBar]} />
          <View style={styles.progressBar} />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/onboarding/step4")}
        >
          <Text style={styles.buttonText}>Continue →</Text>
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

  timeline: { flexDirection: "row", alignItems: "center", marginVertical: 40 },
  line: { height: 2, flex: 1, backgroundColor: "#111A2E" },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#23324D",
    marginHorizontal: 15
  },

  activeDot: { backgroundColor: "#111A2E" },

  footer: { marginBottom: 40 },
  progressContainer: { flexDirection: "row", gap: 8, marginBottom: 20 },
  progressBar: { height: 2, flex: 1, backgroundColor: "#23324D" },
  activeBar: { backgroundColor: "#111A2E" },

  button: { backgroundColor: "#111A2E", padding: 18, borderRadius: 4, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "500" }
});