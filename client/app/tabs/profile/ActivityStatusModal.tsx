import React from "react";
import { Modal, Pressable, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Status = "Active" | "Away" | "Offline";

type Props = {
  visible: boolean;
  currentStatus: Status;
  onClose: () => void;
  onStatusChange: (status: Status) => void;
};

const statusOptions: Array<{ status: Status; color: string; label: string }> = [
  { status: "Active", color: "#22c55e", label: "Active" },
  { status: "Away", color: "#eab308", label: "Away" },
  { status: "Offline", color: "#9ca3af", label: "Offline" },
];

export function ActivityStatusModal({ visible, currentStatus, onClose, onStatusChange }: Props) {
  const handleStatusSelect = (status: Status) => {
    onStatusChange(status);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPress} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Activity Status</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.content}>
            {statusOptions.map((option) => (
              <Pressable
                key={option.status}
                style={[
                  styles.statusOption,
                  currentStatus === option.status && styles.statusOptionActive,
                ]}
                onPress={() => handleStatusSelect(option.status)}
              >
                <View style={[styles.statusDot, { backgroundColor: option.color }]} />
                <Text
                  style={[
                    styles.statusLabel,
                    currentStatus === option.status && styles.statusLabelActive,
                  ]}
                >
                  {option.label}
                </Text>
                {currentStatus === option.status && (
                  <Ionicons name="checkmark" size={20} color="#2f80ed" style={{ marginLeft: "auto" }} />
                )}
              </Pressable>
            ))}
          </View>
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
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  statusOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "transparent",
  },
  statusOptionActive: {
    backgroundColor: "#eff6ff",
    borderColor: "#93c5fd",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusLabel: { fontSize: 16, fontWeight: "600", color: "#333" },
  statusLabelActive: { color: "#2f80ed", fontWeight: "700" },
});
