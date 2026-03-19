import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Step1() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>MineO</Text>
        <Text style={styles.title}>
          Reflect. Visualize. Move forward with intention.
        </Text>
        <Text style={styles.description}>
          A personal workspace designed for clarity, not stimulation. Track your well-being, reflect on life moments, and build meaningful progress.
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, styles.activeBar]} />
          <View style={styles.progressBar} />
          <View style={styles.progressBar} />
          <View style={styles.progressBar} />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/onboarding/step2')}
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

  logo: { fontSize: 42, fontWeight: '300', marginBottom: 40 },
  title: { fontSize: 22, fontWeight: '600', textAlign: 'center', marginBottom: 20 },
  description: { fontSize: 16, textAlign: 'center', color: "#CFDBEF", lineHeight: 24 },

  footer: { marginBottom: 40 },
  progressContainer: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  progressBar: { height: 2, flex: 1, backgroundColor: "#23324D" },
  activeBar: { backgroundColor: "#111A2E" },

  button: { backgroundColor: "#111A2E", padding: 18, borderRadius: 4, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '500' }
});