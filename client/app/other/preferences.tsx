import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

type Theme = "Light" | "Dark" | "Auto";
type Language = "English" | "Spanish" | "French" | "German";

export default function PreferencesScreen() {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>("Light");
  const [language, setLanguage] = useState<Language>("English");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preferences</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APPEARANCE</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Theme</Text>

            {(["Light", "Dark", "Auto"] as Theme[]).map((themeOption) => (
              <TouchableOpacity
                key={themeOption}
                style={styles.radioOption}
                onPress={() => setTheme(themeOption)}
              >
                <Text style={styles.radioText}>{themeOption}</Text>
                <View style={styles.radioCircle}>
                  {theme === themeOption && <View style={styles.radioSelected} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LANGUAGE</Text>

          <View style={styles.selectCard}>
            <TouchableOpacity style={styles.selectButton}>
              <Text style={styles.selectText}>{language}</Text>
              <Ionicons name="chevron-down" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#1C1C1E",
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C31",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#A1A1AA",
    paddingHorizontal: 20,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#1C1C1E",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  radioText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22C55E",
  },
  selectCard: {
    backgroundColor: "#1C1C1E",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});
