import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Step3() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerText}>Memory as Foundation</Text>
        <Text style={styles.subHeaderText}>Your journey shapes you</Text>

        <Vertical: 40,
          }}
        >
          <View style={{ height: 2, flex: 1, backgroundColor: "#000" }} />
          {/* Dots representation */}
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: i === 4 ? "#000" : "#D9E3F1",
                marginHorizontal: 15,
              }}
            />
          ))}
        </View>

        <Text style={styles.description}>
          Life moments - both challenging and meaningful - form your personal
          narrative. Reflection helps you understand where you've been and where
          you're heading.
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
          <Text style={styles.buttonText}>Continue -></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6FA", padding: 30 },
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
    color: "#444",
    lineHeight: 24,
  },
  footer: { marginBottom: 40 },
  progressContainer: { flexDirection: "row", gap: 8, marginBottom: 20 },
  progressBar: { height: 2, flex: 1, backgroundColor: "#D9E3F1" },
  activeBar: { backgroundColor: "#000" },
  button: {
    backgroundColor: "#000",
    padding: 18,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "500" },

  headerText: { fontSize: 24, fontWeight: "bold", alignSelf: "flex-start" },
  subHeaderText: {
    fontSize: 16,
    color: "#666",
    alignSelf: "flex-start",
    marginBottom: 30,
  },
  diagramContainer: {
    width: "100%",
    padding: 20,
    backgroundColor: "#EAF1FB",
    borderRadius: 8,
    marginVertical: 30,
    alignItems: "center",
  },
  diagramText: { fontSize: 14, fontWeight: "500" },
  caption: { fontSize: 12, marginTop: 10, color: "#888" },
  loopArrow: {
    width: 60,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    marginTop: 8,
  },
});

