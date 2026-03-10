import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/constants/colors';

export default function Step2() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerText}>Understanding Patterns</Text>
        <Text style={styles.subHeaderText}>Awareness builds clarity</Text>
        
        {/* Diagram Placeholder */}
        <View style={styles.diagramContainer}>
           <Text style={styles.diagramText}>Trigger → Response → Relief</Text>
           <View style={styles.loopArrow} />
           <Text style={styles.caption}>Automatic pattern</Text>
        </View>

        <Text style={styles.description}>
          Your mind operates through habit loops. Stress triggers automatic responses. By observing these patterns without judgment, you create space for intentional change.
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, styles.activeBar]} />
          <View style={[styles.progressBar, styles.activeBar]} />
          <View style={styles.progressBar} />
          <View style={styles.progressBar} />
        </View>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/onboarding/step3')}>
          <Text style={styles.buttonText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Combined shared onboarding styles + step2-specific styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 30 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { fontSize: 42, fontWeight: '300', marginBottom: 40, fontFamily: 'serif', color: colors.text.primary },
  title: { fontSize: 22, fontWeight: '600', textAlign: 'center', marginBottom: 20, color: colors.text.primary },
  description: { fontSize: 16, textAlign: 'center', color: colors.text.secondary, lineHeight: 24 },
  footer: { marginBottom: 40 },
  progressContainer: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  progressBar: { height: 3, flex: 1, backgroundColor: colors.borderLight, borderRadius: 2 },
  activeBar: { backgroundColor: colors.primary },
  button: { backgroundColor: colors.primary, padding: 18, borderRadius: 16, alignItems: 'center', shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  buttonText: { color: colors.text.light, fontSize: 16, fontWeight: '700' },

  headerText: { fontSize: 24, fontWeight: 'bold', alignSelf: 'flex-start', color: colors.text.primary },
  subHeaderText: { fontSize: 16, color: colors.text.muted, alignSelf: 'flex-start', marginBottom: 30 },
  diagramContainer: { width: '100%', padding: 20, backgroundColor: colors.cardAlt, borderRadius: 16, marginVertical: 30, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  diagramText: { fontSize: 14, fontWeight: '500', color: colors.text.primary },
  caption: { fontSize: 12, marginTop: 10, color: colors.text.muted },
  loopArrow: { width: 60, height: 4, backgroundColor: colors.primary, borderRadius: 2, marginTop: 8 }
});