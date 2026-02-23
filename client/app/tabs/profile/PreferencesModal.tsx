import React, { useState } from "react";
import { Modal, Pressable, Text, View, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  theme: "Light" | "Dark" | "Auto";
  language: string;
  onClose: () => void;
  onThemeChange: (theme: "Light" | "Dark" | "Auto") => void;
  onLanguageChange: (language: string) => void;
};

const languages = ["English", "Spanish", "French", "German", "Portuguese"];

export function PreferencesModal({
  visible,
  theme,
  language,
  onClose,
  onThemeChange,
  onLanguageChange,
}: Props) {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPress} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Preferences</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Appearance */}
            <Text style={styles.sectionTitle}>APPEARANCE</Text>

            <View style={styles.themeSection}>
              <Text style={styles.label}>Theme</Text>

              {(["Light", "Dark", "Auto"] as const).map((t) => (
                <Pressable
                  key={t}
                  style={[styles.option, theme === t && styles.optionActive]}
                  onPress={() => onThemeChange(t)}
                >
                  <View style={[styles.radio, theme === t && styles.radioActive]} />
                  <Text style={[styles.optionLabel, theme === t && styles.optionLabelActive]}>{t}</Text>
                </Pressable>
              ))}
            </View>

            {/* Language */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>LANGUAGE</Text>

            <Pressable
              style={styles.selectInput}
              onPress={() => setShowLanguageDropdown(!showLanguageDropdown)}
            >
              <Text style={styles.selectText}>{language || "Select Language"}</Text>
              <Text style={styles.selectArrow}>▼</Text>
            </Pressable>

            {showLanguageDropdown && (
              <View style={styles.dropdown}>
                {languages.map((lang) => (
                  <Pressable
                    key={lang}
                    style={styles.dropdownItem}
                    onPress={() => {
                      onLanguageChange(lang);
                      setShowLanguageDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownText,
                        language === lang && styles.dropdownTextActive,
                      ]}
                    >
                      {lang}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.35)" },
  backdropPress: { ...StyleSheet.absoluteFillObject },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingBottom: 18,
    maxHeight: "75%",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  title: { fontSize: 16, fontWeight: "700", color: "#111" },
  close: { fontSize: 20, fontWeight: "600", color: "#999" },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#9ca3af",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  themeSection: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fafafa",
  },
  label: { fontSize: 14, fontWeight: "700", color: "#111", marginBottom: 12 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  optionActive: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#93c5fd",
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#d1d5db",
    marginRight: 12,
  },
  radioActive: { borderColor: "#2f80ed", backgroundColor: "#2f80ed" },
  optionLabel: { fontSize: 14, fontWeight: "600", color: "#333" },
  optionLabelActive: { fontWeight: "700", color: "#2f80ed" },
  selectInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fafafa",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  selectText: { fontSize: 14, color: "#111" },
  selectArrow: { fontSize: 12, color: "#999" },
  dropdown: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    marginTop: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownText: { fontSize: 14, color: "#666" },
  dropdownTextActive: { color: "#2f80ed", fontWeight: "700" },
});
