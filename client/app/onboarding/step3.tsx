import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAppTheme } from "../../src/design-system";
import type { AppTheme } from "../../src/design-system";

const AUTH_BUTTON_COLOR = "#8C7F6A";

export default function Step3() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

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

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: 30 },
    content: { flex: 1, justifyContent: "center", alignItems: "center" },

    headerText: { fontSize: 24, fontWeight: "bold", alignSelf: "flex-start", color: theme.colors.text },
    subHeaderText: { fontSize: 16, color: theme.colors.textMuted, alignSelf: "flex-start", marginBottom: 30 },

    description: { fontSize: 16, textAlign: "center", color: theme.colors.textMuted, lineHeight: 24 },

    timeline: { flexDirection: "row", alignItems: "center", marginVertical: 40 },
    line: { height: 2, flex: 1, backgroundColor: theme.colors.text },

    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.border,
      marginHorizontal: 15,
    },

    activeDot: { backgroundColor: theme.colors.primary },

    footer: { marginBottom: 40 },
    progressContainer: { flexDirection: "row", gap: 8, marginBottom: 20 },
    progressBar: { height: 2, flex: 1, backgroundColor: theme.colors.border },
    activeBar: { backgroundColor: theme.colors.text },

    button: { backgroundColor: AUTH_BUTTON_COLOR, padding: 18, borderRadius: 8, alignItems: "center" },
    buttonText: { color: theme.colors.primaryForeground, fontSize: 16, fontWeight: "500" },
  });