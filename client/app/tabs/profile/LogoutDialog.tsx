import React from "react";
import { Modal, Pressable, Text, View, StyleSheet } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function LogoutDialog({ visible, onClose, onConfirm }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPress} onPress={onClose} />
        <View style={styles.dialog}>
          <Text style={styles.title}>Logout</Text>
          <Text style={styles.message}>Are you sure you want to logout?</Text>

          <View style={styles.buttonGroup}>
            <Pressable
              style={[styles.button, styles.logoutButton]}
              onPress={() => {
                onConfirm();
                onClose();
              }}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  backdropPress: { ...StyleSheet.absoluteFillObject },
  dialog: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 22,
    width: "80%",
    maxWidth: 300,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonGroup: {
    width: "100%",
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#fecaca",
  },
  logoutButtonText: {
    fontWeight: "700",
    color: "#dc2626",
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: "#dbeafe",
  },
  cancelButtonText: {
    fontWeight: "700",
    color: "#2563eb",
    fontSize: 14,
  },
});
