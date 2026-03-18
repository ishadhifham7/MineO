import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

type Theme = "Light" | "Dark" | "Auto";
type Language = "English" | "Spanish" | "French" | "German";

export default function PreferencesScreen() {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>("Light");
  const [language, setLanguage] = useState<Language>("English");

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <LinearGradient
          colors={["#B5A993", "#8C7F6A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerIconButton}
            >
              <Ionicons name="chevron-back" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>Preferences</Text>
              <Text style={styles.headerSubtitle}>
                Language and appearance settings
              </Text>
            </View>

            <View style={styles.headerIconButtonPlaceholder} />
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Theme</Text>
              <View style={styles.themeRow}>
                {(["Light", "Dark", "Auto"] as Theme[]).map((option) => {
                  const active = theme === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.themePill,
                        active && styles.themePillActive,
                      ]}
                      onPress={() => setTheme(option)}
                    >
                      <Text
                        style={[
                          styles.themePillText,
                          active && styles.themePillTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={styles.sectionWrap}>
            <Text style={styles.sectionTitle}>Language</Text>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>App Language</Text>
              {(["English", "Spanish", "French", "German"] as Language[]).map(
                (option) => {
                  const active = language === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.selectRow,
                        active && styles.selectRowActive,
                      ]}
                      onPress={() => setLanguage(option)}
                    >
                      <Text
                        style={[
                          styles.selectText,
                          active && styles.selectTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                      {active ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={18}
                          color="#B5A993"
                        />
                      ) : (
                        <Ionicons
                          name="ellipse-outline"
                          size={18}
                          color="#C3BCB1"
                        />
                      )}
                    </TouchableOpacity>
                  );
                },
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F6F1E7",
  },
  container: {
    flex: 1,
    backgroundColor: "#F6F1E7",
  },
  headerGradient: {
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconButtonPlaceholder: {
    width: 36,
    height: 36,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    marginTop: 2,
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
    gap: 14,
  },
  sectionWrap: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#8C7F6A",
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5DFD3",
    padding: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E2A26",
  },
  themeRow: {
    flexDirection: "row",
    gap: 8,
  },
  themePill: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5DFD3",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    alignItems: "center",
  },
  themePillActive: {
    backgroundColor: "#B5A993",
    borderColor: "#B5A993",
  },
  themePillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B645C",
  },
  themePillTextActive: {
    color: "#FFFFFF",
  },
  selectRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F6F1E7",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectRowActive: {
    borderColor: "#D9D2C5",
    backgroundColor: "#F3EEE4",
  },
  selectText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E2A26",
  },
  selectTextActive: {
    color: "#6B645C",
  },
});
