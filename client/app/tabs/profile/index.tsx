import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { ProfileHeaderCard } from "./ProfileHeaderCard";
import { SocialStatsRow } from "./SocialStatsRow";
import { AchievementsRow } from "./AchievementsRow";
import { ActivityStatusRow } from "./ActivityStatusRow";
import { MenuSection } from "./MenuSection";
import { MenuItemRow } from "./MenuItemRow";
import { EditProfileModal } from "./EditProfileModal";
import { ActivityStatusModal } from "./ActivityStatusModal";
import { EditInfoModal } from "./EditInfoModal";
import { PrivacySettingsModal } from "./PrivacySettingsModal";
import { PreferencesModal } from "./PreferencesModal";
import { LogoutDialog } from "./LogoutDialog";

export default function ProfileScreen() {
  const router = useRouter();

  // Profile state
  const [fullName, setFullName] = useState("Omar");
  const [username, setUsername] = useState("omar_dev");
  const [email, setEmail] = useState("omar@example.com");
  const [bio, setBio] = useState("Designer & developer");
  const [status, setStatus] = useState<"Active" | "Away" | "Offline">("Active");

  // Personal info state
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [birthday, setBirthday] = useState("05/15/1990");
  const [gender, setGender] = useState("Male");
  const [location, setLocation] = useState("San Francisco, CA");
  const [website, setWebsite] = useState("https://omar.dev");

  // Privacy state
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [activityTracking, setActivityTracking] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  // Preferences state
  const [theme, setTheme] = useState<"Light" | "Dark" | "Auto">("Light");
  const [language, setLanguage] = useState("English");

  // Modal visibility states
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [activityStatusOpen, setActivityStatusOpen] = useState(false);
  const [editInfoOpen, setEditInfoOpen] = useState(false);
  const [privacySettingsOpen, setPrivacySettingsOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  // Modal handlers
  const handleEditProfile = (data: { fullName: string; username: string; email: string; bio: string }) => {
    setFullName(data.fullName);
    setUsername(data.username);
    setEmail(data.email);
    setBio(data.bio);
  };

  const handleEditInfo = (data: { phone: string; birthday: string; gender: string; location: string; website: string }) => {
    setPhone(data.phone);
    setBirthday(data.birthday);
    setGender(data.gender);
    setLocation(data.location);
    setWebsite(data.website);
  };

  const handleDownloadData = () => {
    Alert.alert("Download", "Your data is being prepared for download. You'll receive an email shortly.");
  };

  const handleDeleteAccount = () => {
    Alert.alert("Delete Account", "This action cannot be undone. Please contact support if you have questions.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => Alert.alert("Account Deleted", "Your account has been deleted.") },
    ]);
  };

  const handleLogout = () => {
    Alert.alert("Logged Out", "You have been logged out successfully.");
    router.replace("/auth/login");
  };

  const achievements: Array<{ id: string; title: string; icon: "trophy" | "star" | "award" | "target"; earned: boolean }> = [
    { id: "1", title: "First Goal", icon: "trophy", earned: true },
    { id: "2", title: "Week Streak", icon: "star", earned: true },
    { id: "3", title: "Early Bird", icon: "award", earned: true },
    { id: "4", title: "Perfectionist", icon: "target", earned: false },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView>
        <ProfileHeaderCard
          name={fullName}
          username={username}
          email={email}
          bio={bio}
          avatarUrl={null}
          onEditPress={() => setEditProfileOpen(true)}
        />

        <SocialStatsRow followers={1248} following={856} />

        <AchievementsRow achievements={achievements} />

        <ActivityStatusRow status={status} onPress={() => setActivityStatusOpen(true)} />

        <MenuSection title="ACCOUNT MANAGEMENT">
          <MenuItemRow
            icon="person-outline"
            label="Personal Details"
            onPress={() => setEditInfoOpen(true)}
          />
          <MenuItemRow
            icon="settings-outline"
            label="Account Settings"
            onPress={() => setPrivacySettingsOpen(true)}
          />
          <MenuItemRow
            icon="globe-outline"
            label="Language & Theme"
            onPress={() => setPreferencesOpen(true)}
          />
        </MenuSection>

        <MenuSection title="NEED HELP?">
          <MenuItemRow icon="bulb-outline" label="Tips and Tricks" onPress={() => {}} />
          <MenuItemRow icon="help-circle-outline" label="Frequently Asked Questions" onPress={() => {}} />
          <MenuItemRow icon="mail-outline" label="Contact Us" onPress={() => {}} />
        </MenuSection>

        <Pressable style={styles.logout} onPress={() => setLogoutOpen(true)}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>

      {/* Modals */}
      <EditProfileModal
        visible={editProfileOpen}
        fullName={fullName}
        username={username}
        email={email}
        bio={bio}
        onClose={() => setEditProfileOpen(false)}
        onSave={handleEditProfile}
      />

      <ActivityStatusModal
        visible={activityStatusOpen}
        currentStatus={status}
        onClose={() => setActivityStatusOpen(false)}
        onStatusChange={setStatus}
      />

      <EditInfoModal
        visible={editInfoOpen}
        phone={phone}
        birthday={birthday}
        gender={gender}
        location={location}
        website={website}
        onClose={() => setEditInfoOpen(false)}
        onSave={handleEditInfo}
      />

      <PrivacySettingsModal
        visible={privacySettingsOpen}
        showEmail={showEmail}
        showPhone={showPhone}
        activityTracking={activityTracking}
        dataSharing={dataSharing}
        onClose={() => setPrivacySettingsOpen(false)}
        onToggleEmail={setShowEmail}
        onTogglePhone={setShowPhone}
        onToggleTracking={setActivityTracking}
        onToggleSharing={setDataSharing}
        onDownloadData={handleDownloadData}
        onDeleteAccount={handleDeleteAccount}
      />

      <PreferencesModal
        visible={preferencesOpen}
        theme={theme}
        language={language}
        onClose={() => setPreferencesOpen(false)}
        onThemeChange={setTheme}
        onLanguageChange={setLanguage}
      />

      <LogoutDialog
        visible={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f5f5f0",
  },
  logout: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#ef4444",
    fontWeight: "bold",
    fontSize: 14,
  },
});