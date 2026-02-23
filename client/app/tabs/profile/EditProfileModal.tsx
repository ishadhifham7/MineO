import React, { useState } from "react";
import { Modal, Pressable, Text, View, StyleSheet, TextInput, ScrollView } from "react-native";

type Props = {
  visible: boolean;
  fullName: string;
  username: string;
  email: string;
  bio: string;
  onClose: () => void;
  onSave: (data: { fullName: string; username: string; email: string; bio: string }) => void;
};

export function EditProfileModal({ visible, fullName, username, email, bio, onClose, onSave }: Props) {
  const [name, setName] = useState(fullName);
  const [user, setUser] = useState(username);
  const [emailState, setEmailState] = useState(email);
  const [bioState, setBioState] = useState(bio);
  const bioChars = bioState.length;
  const maxBioChars = 150;

  const handleSave = () => {
    onSave({ fullName: name, username: user, email: emailState, bio: bioState });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPress} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Profile</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter full name"
                placeholderTextColor="#ccc"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={user}
                onChangeText={setUser}
                placeholder="@username"
                placeholderTextColor="#ccc"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={emailState}
                onChangeText={setEmailState}
                placeholder="email@example.com"
                placeholderTextColor="#ccc"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.bioHeader}>
                <Text style={styles.label}>Bio</Text>
                <Text style={styles.charCount}>
                  {bioChars}/{maxBioChars}
                </Text>
              </View>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={bioState}
                onChangeText={setBioState}
                placeholder="Tell us about yourself"
                placeholderTextColor="#ccc"
                multiline
                maxLength={maxBioChars}
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
  bioInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  bioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  charCount: { fontSize: 12, color: "#999" },
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
