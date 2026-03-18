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
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
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
              <Ionicons name="chevron-forward" size={20} color="#A1A1AA" />
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
              trackColor={{ false: "#2C2C31", true: "#22C55E" }}
              thumbColor={showEmail ? "#FFFFFF" : "#FFFFFF"}
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
              trackColor={{ false: "#2C2C31", true: "#22C55E" }}
              thumbColor={showPhone ? "#FFFFFF" : "#FFFFFF"}
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
              trackColor={{ false: "#2C2C31", true: "#22C55E" }}
              thumbColor={activityTracking ? "#FFFFFF" : "#FFFFFF"}
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
              trackColor={{ false: "#2C2C31", true: "#22C55E" }}
              thumbColor={dataSharing ? "#FFFFFF" : "#FFFFFF"}
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Download My Data</Text>
            <Ionicons name="chevron-forward" size={20} color="#A1A1AA" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.dangerMenuItem}>
            <Text style={styles.dangerMenuText}>Delete Account</Text>
            <Ionicons name="chevron-forward" size={20} color="#EF4444" />
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#A1A1AA",
    paddingHorizontal: 20,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1C1C1E",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#121212",
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuValue: {
    fontSize: 15,
    color: "#A1A1AA",
  },
  switchItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1C1C1E",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#121212",
  },
  switchLeft: {
    flex: 1,
    marginRight: 16,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 13,
    color: "#A1A1AA",
  },
  dangerMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1C1C1E",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  dangerMenuText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#EF4444",
  },
});
