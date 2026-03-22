import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../src/design-system';
import type { AppTheme } from '../../src/design-system';

export default function Step2() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerText}>Understanding Patterns</Text>
        <Text style={styles.subHeaderText}>Awareness builds clarity</Text>

        <View style={styles.diagramContainer}>
          <Text style={styles.diagramText}>Trigger → Response → Relief</Text>
          <View style={styles.loopArrow} />
          <Text style={styles.caption}>Automatic pattern</Text>
        </View>

        <Text style={styles.description}>
          Your mind operates through habit loops. Stress triggers automatic responses.
          By observing these patterns without judgment, you create space for intentional change.
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, styles.activeBar]} />
          <View style={[styles.progressBar, styles.activeBar]} />
          <View style={styles.progressBar} />
          <View style={styles.progressBar} />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/onboarding/step3')}
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
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    headerText: { fontSize: 24, fontWeight: 'bold', alignSelf: 'flex-start', color: theme.colors.text },
    subHeaderText: { fontSize: 16, color: theme.colors.textMuted, alignSelf: 'flex-start', marginBottom: 30 },

    description: { fontSize: 16, textAlign: 'center', color: theme.colors.textMuted, lineHeight: 24 },

    diagramContainer: {
      width: '100%',
      padding: 20,
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: 8,
      marginVertical: 30,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    diagramText: { fontSize: 14, fontWeight: '500', color: theme.colors.text },
    caption: { fontSize: 12, marginTop: 10, color: theme.colors.textMuted },
    loopArrow: { width: 60, height: 4, backgroundColor: theme.colors.text, borderRadius: 2, marginTop: 8 },

    footer: { marginBottom: 40 },
    progressContainer: { flexDirection: 'row', gap: 8, marginBottom: 20 },
    progressBar: { height: 2, flex: 1, backgroundColor: theme.colors.border },
    activeBar: { backgroundColor: theme.colors.text },

    button: { backgroundColor: theme.colors.primary, padding: 18, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: theme.colors.primaryForeground, fontSize: 16, fontWeight: '500' }
  }); 