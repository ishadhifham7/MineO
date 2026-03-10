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
import { useState } from "react";
import { colors } from "../../src/constants/colors";

export default function AccountSettingsScreen() {
  const router = useRouter();
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [activityTracking, setActivityTracking] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState("Public");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Visibility Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROFILE VISIBILITY</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Profile Visibility</Text>
            <View style={styles.menuRight}>
              <Text style={styles.menuValue}>{profileVisibility}</Text>
              <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Contact Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTACT INFORMATION</Text>
          
          <View style={styles.switchItem}>
            <View style={styles.switchLeft}>
              <Text style={styles.switchTitle}>Show Email</Text>
              <Text style={styles.switchDescription}>Display email on your profile</Text>
            </View>
            <Switch
              value={showEmail}
              onValueChange={setShowEmail}
              trackColor={{ false: "#E0E0E0", true: "#81C784" }}
              thumbColor={showEmail ? "#fff" : "#fff"}
            />
          </View>

          <View style={styles.switchItem}>
            <View style={styles.switchLeft}>
              <Text style={styles.switchTitle}>Show Phone Number</Text>
              <Text style={styles.switchDescription}>Display phone number on your profile</Text>
            </View>
            <Switch
              value={showPhone}
              onValueChange={setShowPhone}
              trackColor={{ false: "#E0E0E0", true: "#81C784" }}
              thumbColor={showPhone ? "#fff" : "#fff"}
            />
          </View>
        </View>

        {/* Data & Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA & PRIVACY</Text>
          
          <View style={styles.switchItem}>
            <View style={styles.switchLeft}>
              <Text style={styles.switchTitle}>Activity Tracking</Text>
              <Text style={styles.switchDescription}>Track your app usage and activities</Text>
            </View>
            <Switch
              value={activityTracking}
              onValueChange={setActivityTracking}
              trackColor={{ false: "#E0E0E0", true: "#4CAF50" }}
              thumbColor={activityTracking ? "#fff" : "#fff"}
            />
          </View>

          <View style={styles.switchItem}>
            <View style={styles.switchLeft}>
              <Text style={styles.switchTitle}>Data Sharing</Text>
              <Text style={styles.switchDescription}>
                Share anonymized data for improvements
              </Text>
            </View>
            <Switch
              value={dataSharing}
              onValueChange={setDataSharing}
              trackColor={{ false: "#E0E0E0", true: "#4CAF50" }}
              thumbColor={dataSharing ? "#fff" : "#fff"}
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Download My Data</Text>
            <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.dangerMenuItem}>
            <Text style={styles.dangerMenuText}>Delete Account</Text>
            <Ionicons name="chevron-forward" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.muted,
    paddingHorizontal: 20,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text.primary,
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuValue: {
    fontSize: 15,
    color: colors.text.secondary,
  },
  switchItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  switchLeft: {
    flex: 1,
    marginRight: 16,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text.primary,
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  dangerMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  dangerMenuText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#F44336",
  },
});
