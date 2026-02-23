import React, { useState } from "react";
import { Modal, Pressable, Text, View, StyleSheet, TextInput, ScrollView } from "react-native";

type Props = {
  visible: boolean;
  phone: string;
  birthday: string;
  gender: string;
  location: string;
  website: string;
  onClose: () => void;
  onSave: (data: { phone: string; birthday: string; gender: string; location: string; website: string }) => void;
};

const genderOptions = ["Male", "Female", "Other"];

export function EditInfoModal({
  visible,
  phone,
  birthday,
  gender,
  location,
  website,
  onClose,
  onSave,
}: Props) {
  const [phoneState, setPhoneState] = useState(phone);
  const [birthdayState, setBirthdayState] = useState(birthday);
  const [genderState, setGenderState] = useState(gender);
  const [locationState, setLocationState] = useState(location);
  const [websiteState, setWebsiteState] = useState(website);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  const handleSave = () => {
    onSave({
      phone: phoneState,
      birthday: birthdayState,
      gender: genderState,
      location: locationState,
      website: websiteState,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPress} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Information</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phoneState}
                onChangeText={setPhoneState}
                placeholder="+1 (555) 123-4567"
                placeholderTextColor="#ccc"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Birthday</Text>
              <TextInput
                style={styles.input}
                value={birthdayState}
                onChangeText={setBirthdayState}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#ccc"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <Pressable
                style={styles.selectInput}
                onPress={() => setShowGenderDropdown(!showGenderDropdown)}
              >
                <Text style={styles.selectText}>{genderState || "Select Gender"}</Text>
                <Text style={styles.selectArrow}>▼</Text>
              </Pressable>
              {showGenderDropdown && (
                <View style={styles.dropdown}>
                  {genderOptions.map((option) => (
                    <Pressable
                      key={option}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setGenderState(option);
                        setShowGenderDropdown(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownText,
                          genderState === option && styles.dropdownTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={locationState}
                onChangeText={setLocationState}
                placeholder="San Francisco, CA"
                placeholderTextColor="#ccc"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Website</Text>
              <TextInput
                style={styles.input}
                value={websiteState}
                onChangeText={setWebsiteState}
                placeholder="https://example.com"
                placeholderTextColor="#ccc"
                keyboardType="url"
              />
            </View>

            <View style={styles.buttonRow}>
              <Pressable style={[styles.btn, styles.cancelBtn]} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.btn, styles.saveBtn]} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save</Text>
              </Pressable>
            </View>
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
    maxHeight: "85%",
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
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "700", color: "#111", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111",
    backgroundColor: "#fafafa",
  },
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
  },
  selectText: { fontSize: 14, color: "#111" },
  selectArrow: { fontSize: 12, color: "#999" },
  dropdown: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    marginTop: 4,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownText: { fontSize: 14, color: "#666" },
  dropdownTextActive: { color: "#2f80ed", fontWeight: "700" },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  cancelBtn: { backgroundColor: "#f0f0f0" },
  cancelBtnText: { fontWeight: "700", color: "#666", fontSize: 14 },
  saveBtn: { backgroundColor: "#2f80ed" },
  saveBtnText: { fontWeight: "700", color: "#fff", fontSize: 14 },
});
