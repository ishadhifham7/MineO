import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

type Visibility = "Public" | "Friends" | "Private";

export default function AccountSettingsScreen() {
  const router = useRouter();
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [activityTracking, setActivityTracking] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState<Visibility>("Public");

  const renderSwitchRow = (
    title: string,
    description: string,
    value: boolean,
    onChange: (next: boolean) => void,
  ) => (
    <View style={styles.switchRow}>
      <View style={styles.switchTextWrap}>
        <Text style={styles.switchTitle}>{title}</Text>
        <Text style={styles.switchDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#D9D2C5", true: "#B5A993" }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <View style={styles.container}>
        <LinearGradient
          colors={["#B5A993", "#8C7F6A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.headerIconButton}>
              <Ionicons name="chevron-back" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>Account Settings</Text>
              <Text style={styles.headerSubtitle}>Privacy and data controls</Text>
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
            <Text style={styles.sectionTitle}>Profile Visibility</Text>
            <View style={styles.card}>
              <View style={styles.visibilityRow}>
                {(["Public", "Friends", "Private"] as Visibility[]).map((option) => {
                  const active = profileVisibility === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[styles.visibilityPill, active && styles.visibilityPillActive]}
                      onPress={() => setProfileVisibility(option)}
                    >
                      <Text
                        style={[
                          styles.visibilityPillText,
                          active && styles.visibilityPillTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={styles.helperText}>
                Choose who can see your profile information.
              </Text>
            </View>
          </View>

          <View style={styles.sectionWrap}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.card}>{renderSwitchRow(
              "Show Email",
              "Display email on your profile",
              showEmail,
              setShowEmail,
            )}
            {renderSwitchRow(
              "Show Phone Number",
              "Display phone number on your profile",
              showPhone,
              setShowPhone,
            )}</View>
          </View>

          <View style={styles.sectionWrap}>
            <Text style={styles.sectionTitle}>Data and Privacy</Text>
            <View style={styles.card}>{renderSwitchRow(
              "Activity Tracking",
              "Track app usage to improve your experience",
              activityTracking,
              setActivityTracking,
            )}
            {renderSwitchRow(
              "Data Sharing",
              "Share anonymized data for product improvements",
              dataSharing,
              setDataSharing,
            )}</View>
          </View>

          <View style={styles.sectionWrap}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.card}>
              <TouchableOpacity style={styles.menuRow}>
                <View style={styles.menuLeft}>
                  <Ionicons name="download-outline" size={18} color="#6B645C" />
                  <Text style={styles.menuText}>Download My Data</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#8C7F6A" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuRowDanger}>
                <View style={styles.menuLeft}>
                  <Ionicons name="trash-outline" size={18} color="#C05642" />
                  <Text style={styles.menuDangerText}>Delete Account</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C05642" />
              </TouchableOpacity>
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
  visibilityRow: {
    flexDirection: "row",
    gap: 8,
  },
  visibilityPill: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5DFD3",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    alignItems: "center",
  },
  visibilityPillActive: {
    backgroundColor: "#B5A993",
    borderColor: "#B5A993",
  },
  visibilityPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B645C",
  },
  visibilityPillTextActive: {
    color: "#FFFFFF",
  },
  helperText: {
    marginTop: 2,
    fontSize: 12,
    color: "#8C7F6A",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F6F1E7",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  switchTextWrap: {
    flex: 1,
    marginRight: 10,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E2A26",
  },
  switchDescription: {
    marginTop: 2,
    fontSize: 12,
    color: "#8C7F6A",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F6F1E7",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  menuRowDanger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF2EF",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#F3C3B8",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E2A26",
  },
  menuDangerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#C05642",
  },
});
