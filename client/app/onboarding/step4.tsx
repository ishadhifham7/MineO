import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAppTheme } from "../../src/design-system";
import type { AppTheme } from "../../src/design-system";

export default function Step4() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

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

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: 30 },
    content: { flex: 1, justifyContent: "center", alignItems: "center" },

    headerText: { fontSize: 24, fontWeight: "bold", alignSelf: "flex-start", color: theme.colors.text },
    subHeaderText: { fontSize: 16, color: theme.colors.textMuted, alignSelf: "flex-start", marginBottom: 30 },

    description: { fontSize: 16, textAlign: "center", color: theme.colors.textMuted, lineHeight: 24 },

    footer: { marginBottom: 40 },
    progressContainer: { flexDirection: "row", gap: 8, marginBottom: 20 },
    progressBar: { height: 2, flex: 1, backgroundColor: theme.colors.border },
    activeBar: { backgroundColor: theme.colors.text },

    button: {
      backgroundColor: theme.colors.primary,
      padding: 18,
      borderRadius: 8,
      alignItems: "center",
    },

    buttonText: { color: theme.colors.primaryForeground, fontSize: 16, fontWeight: "500" },
  });