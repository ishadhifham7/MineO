import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from '../../src/constants/colors';

export default function Step3() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerText}>Memory as Foundation</Text>
        <Text style={styles.subHeaderText}>Your journey shapes you</Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 40,
          }}
        >
          <View style={{ height: 2, flex: 1, backgroundColor: colors.text.primary }} />
          {/* Dots representation */}
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: i === 4 ? colors.text.primary : colors.borderLight,
                marginHorizontal: 15,
              }}
            />
          ))}
        </View>

        <Text style={styles.description}>
          Life moments—both challenging and meaningful—form your personal
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
          <Text style={styles.buttonText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 30 },
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
    color: colors.text.muted,
    lineHeight: 24,
  },
  footer: { marginBottom: 40 },
  progressContainer: { flexDirection: "row", gap: 8, marginBottom: 20 },
  progressBar: { height: 3, flex: 1, backgroundColor: colors.borderLight, borderRadius: 2 },
  activeBar: { backgroundColor: colors.primary },
  button: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: { color: colors.text.light, fontSize: 16, fontWeight: "700" },

  headerText: { fontSize: 24, fontWeight: "bold", alignSelf: "flex-start", color: colors.text.primary },
  subHeaderText: {
    fontSize: 16,
    color: colors.text.secondary,
    alignSelf: "flex-start",
    marginBottom: 30,
  },
  diagramContainer: {
    width: "100%",
    padding: 20,
    backgroundColor: colors.cardAlt,
    borderRadius: 16,
    marginVertical: 30,
    alignItems: "center",
  },
  diagramText: { fontSize: 14, fontWeight: "500" },
  caption: { fontSize: 12, marginTop: 10, color: colors.text.muted },
  loopArrow: {
    width: 60,
    height: 4,
    backgroundColor: colors.text.primary,
    borderRadius: 2,
    marginTop: 8,
  },
});
