import React, { useState } from "react";
import { Modal, Pressable, Text, View, StyleSheet, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  showEmail: boolean;
  showPhone: boolean;
  activityTracking: boolean;
  dataSharing: boolean;
  onClose: () => void;
  onToggleEmail: (value: boolean) => void;
  onTogglePhone: (value: boolean) => void;
  onToggleTracking: (value: boolean) => void;
  onToggleSharing: (value: boolean) => void;
  onDownloadData: () => void;
  onDeleteAccount: () => void;
};

export function PrivacySettingsModal({
  visible,
  showEmail,
  showPhone,
  activityTracking,
  dataSharing,
  onClose,
  onToggleEmail,
  onTogglePhone,
  onToggleTracking,
  onToggleSharing,
  onDownloadData,
  onDeleteAccount,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPress} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Account Settings</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Profile Visibility */}
            <Text style={styles.sectionTitle}>PROFILE VISIBILITY</Text>
            <Pressable style={styles.row}>
              <Text style={styles.rowLabel}>Profile Visibility</Text>
              <Text style={styles.rowValue}>Public</Text>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </Pressable>

            {/* Contact Information */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>CONTACT INFORMATION</Text>

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.rowLabel}>Show Email</Text>
                <Text style={styles.rowDescription}>Display email on your profile</Text>
              </View>
              <Switch value={showEmail} onValueChange={onToggleEmail} />
            </View>

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.rowLabel}>Show Phone Number</Text>
                <Text style={styles.rowDescription}>Display phone number on your profile</Text>
              </View>
              <Switch value={showPhone} onValueChange={onTogglePhone} />
            </View>

            {/* Data & Privacy */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>DATA & PRIVACY</Text>

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.rowLabel}>Activity Tracking</Text>
                <Text style={styles.rowDescription}>Track your app usage and activities</Text>
              </View>
              <Switch value={activityTracking} onValueChange={onToggleTracking} />
            </View>

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.rowLabel}>Data Sharing</Text>
                <Text style={styles.rowDescription}>Share anonymized data for improvements</Text>
              </View>
              <Switch value={dataSharing} onValueChange={onToggleSharing} />
            </View>

            {/* Account */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>ACCOUNT</Text>

            <Pressable style={styles.row} onPress={onDownloadData}>
              <Text style={styles.rowLabel}>Download My Data</Text>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </Pressable>

            <Pressable style={[styles.row, styles.rowDanger]} onPress={onDeleteAccount}>
              <Text style={styles.rowLabelDanger}>Delete Account</Text>
              <Ionicons name="chevron-forward" size={18} color="#ef4444" />
            </Pressable>

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
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#9ca3af",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  row: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: { flex: 1 },
  rowLabel: { fontSize: 14, fontWeight: "700", color: "#111", marginBottom: 4 },
  rowDescription: { fontSize: 12, color: "#9ca3af" },
  rowValue: { fontSize: 14, fontWeight: "600", color: "#2f80ed" },
  rowDanger: {},
  rowLabelDanger: { fontSize: 14, fontWeight: "700", color: "#ef4444" },
});
