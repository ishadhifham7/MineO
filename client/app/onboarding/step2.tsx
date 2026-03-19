import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Step2() {
  const router = useRouter();

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220", padding: 30 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  headerText: { fontSize: 24, fontWeight: 'bold', alignSelf: 'flex-start' },
  subHeaderText: { fontSize: 16, color: "#B6C6E1", alignSelf: 'flex-start', marginBottom: 30 },

  description: { fontSize: 16, textAlign: 'center', color: "#CFDBEF", lineHeight: 24 },

  diagramContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: "#111A2E",
    borderRadius: 8,
    marginVertical: 30,
    alignItems: 'center'
  },

  diagramText: { fontSize: 14, fontWeight: '500' },
  caption: { fontSize: 12, marginTop: 10, color: '#888' },
  loopArrow: { width: 60, height: 4, backgroundColor: "#DCE6F6", borderRadius: 2, marginTop: 8 },

  footer: { marginBottom: 40 },
  progressContainer: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  progressBar: { height: 2, flex: 1, backgroundColor: "#23324D" },
  activeBar: { backgroundColor: "#111A2E" },

  button: { backgroundColor: "#111A2E", padding: 18, borderRadius: 4, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '500' }
}); 