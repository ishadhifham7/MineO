import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../../src/constants/colors";

import { useProfile } from "../../src/providers/ProfileProvider"; // ✅ adjust if your path differs

type ActivityStatus = "Active" | "Away" | "Offline";

export default function ProfileScreen() {
  const router = useRouter();

  // Context profile
  const { profile, loading, error, refreshProfile, updateProfile, clearProfile } = useProfile();

  // ===== Existing UI state =====
  const [activityStatus, setActivityStatus] = useState<ActivityStatus>("Active");
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showEditInfoModal, setShowEditInfoModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // Privacy settings state
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [activityTracking, setActivityTracking] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  const [theme, setTheme] = useState<"Light" | "Dark" | "Auto">("Light");

  // Edit Profile form state (draft)
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  // Personal Details form state (draft)
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");

  // Contact form state
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // ===== Load profile when screen opens =====
  useEffect(() => {
    refreshProfile().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== Sync local draft state from context profile =====
  useEffect(() => {
    if (!profile) return;

    setFullName(profile.name ?? "");
    setUsername(profile.username ?? "");
    setEmail(profile.email ?? "");
    setBio(profile.bio ?? "");

    setPhoneNumber(profile.phoneNumber ?? "");
    setBirthday(profile.birthday ?? "");
    setGender(profile.gender ?? "");
    setCountry(profile.country ?? "");

    setShowEmail(Boolean(profile.showEmail));
    setShowPhone(Boolean(profile.showPhone));
    setActivityTracking(profile.activityTracking !== false);
    setDataSharing(Boolean(profile.dataSharing));
  }, [profile]);

  const getStatusColor = (status: ActivityStatus) => {
    switch (status) {
      case "Active":
        return "#4CAF50";
      case "Away":
        return "#FFA726";
      case "Offline":
        return "#9E9E9E";
    }
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);

    // Prevent old user info showing after logout
    clearProfile();

    
    router.replace("/auth/login");
  };

  // ===== Save handlers =====
  const saveEditProfile = async () => {
    try {
      await updateProfile({
        name: fullName,
        bio,
      });
      setShowEditProfileModal(false);
      Alert.alert("Success", "Profile updated successfully.");
    } catch (e: any) {
      Alert.alert("Update failed", e?.message || "Could not update profile.");
    }
  };

  const savePersonalDetails = async () => {
    try {
      await updateProfile({
        phoneNumber,
        birthday,
        gender,
        country,
      });
      setShowEditInfoModal(false);
      Alert.alert("Success", "Personal details updated successfully.");
    } catch (e: any) {
      Alert.alert("Update failed", e?.message || "Could not update personal details.");
    }
  };

  const pickAndSavePhoto = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert("Permission required", "Please allow photo access to change profile picture.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset?.base64) {
        Alert.alert("Error", "Could not read image data.");
        return;
      }

      // Store as data URL (simple, works immediately).
      const dataUrl = `data:image/jpeg;base64,${asset.base64}`;

      await updateProfile({ photoUrl: dataUrl });
      setShowPhotoModal(false);
      Alert.alert("Success", "Profile photo updated.");
    } catch (e: any) {
      Alert.alert("Upload failed", e?.message || "Could not update profile photo.");
    }
  };


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Error banner */}
        {!!error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => refreshProfile()} style={styles.retryBtn}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity
            style={styles.avatar}
            activeOpacity={0.8}
            onPress={pickAndSavePhoto}
          >
            {profile?.photoUrl ? (
              <Image
                source={{ uri: profile.photoUrl }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="person" size={48} color="#9E9E9E" />
            )}
          </TouchableOpacity>

          <Text style={styles.profileName}>
            {loading && !profile ? "Loading..." : fullName || "—"}
          </Text>
          <Text style={styles.profileUsername}>@{username || "—"}</Text>
          <Text style={styles.profileBio}>{bio || "—"}</Text>

          <TouchableOpacity style={styles.editProfileButton} onPress={() => setShowEditProfileModal(true)}>
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Activity Status */}
        <TouchableOpacity style={styles.statusRow} onPress={() => setShowActivityModal(true)}>
          <View style={styles.statusLeft}>
            <View style={styles.statusIconContainer}>
              <Ionicons name="radio-button-on" size={24} color="#000" />
            </View>
            <Text style={styles.statusText}>Activity Status</Text>
          </View>
          <View style={styles.statusRight}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(activityStatus) }]} />
            <Text style={[styles.statusLabel, { color: getStatusColor(activityStatus) }]}>
              {activityStatus}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
          </View>
        </TouchableOpacity>

        {/* Account Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT MANAGEMENT</Text>

          <TouchableOpacity style={styles.menuItem} onPress={() => setShowEditInfoModal(true)}>
            <View style={styles.menuLeft}>
              <Ionicons name="person-outline" size={24} color="#000" />
              <Text style={styles.menuText}>Personal Details</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/other/account-settings")}>
            <View style={styles.menuLeft}>
              <Ionicons name="settings-outline" size={24} color="#000" />
              <Text style={styles.menuText}>Account Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/other/preferences")}>
            <View style={styles.menuLeft}>
              <Ionicons name="color-palette-outline" size={24} color="#000" />
              <Text style={styles.menuText}>Language & Theme</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
          </TouchableOpacity>
        </View>

        {/* Need Help */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NEED HELP?</Text>

          <TouchableOpacity style={styles.menuItem} onPress={() => setShowTipsModal(true)}>
            <View style={styles.menuLeft}>
              <Ionicons name="bulb-outline" size={24} color="#000" />
              <Text style={styles.menuText}>Tips and Tricks</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => setShowFAQModal(true)}>
            <View style={styles.menuLeft}>
              <Ionicons name="help-circle-outline" size={24} color="#000" />
              <Text style={styles.menuText}>Frequently Asked Questions</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => setShowContactModal(true)}>
            <View style={styles.menuLeft}>
              <Ionicons name="mail-outline" size={24} color="#000" />
              <Text style={styles.menuText}>Contact Us</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => setShowLogoutModal(true)}>
          <Ionicons name="log-out-outline" size={20} color="#F44336" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      

      {/* Activity Status Modal */}
      <Modal visible={showActivityModal} transparent animationType="fade" onRequestClose={() => setShowActivityModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Activity Status</Text>
              <TouchableOpacity onPress={() => setShowActivityModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              {(["Active", "Away", "Offline"] as ActivityStatus[]).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[styles.statusOption, activityStatus === status && styles.statusOptionSelected]}
                  onPress={() => {
                    setActivityStatus(status);
                    setShowActivityModal(false);
                  }}
                >
                  <View style={styles.statusOptionLeft}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
                    <Text style={styles.statusOptionText}>{status}</Text>
                  </View>
                  {activityStatus === status && <Ionicons name="checkmark" size={24} color="#2196F3" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Information Modal */}
      <Modal visible={showEditInfoModal} transparent animationType="slide" onRequestClose={() => setShowEditInfoModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Information</Text>
              <TouchableOpacity onPress={() => setShowEditInfoModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.editFormScroll}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone Number</Text>
                <TextInput style={styles.formInput} value={phoneNumber} onChangeText={setPhoneNumber} placeholder="+1 (555) 123-4567" />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Birthday</Text>
                <TextInput style={styles.formInput} value={birthday} onChangeText={setBirthday} placeholder="05/15/1990" />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Gender</Text>
                <View style={styles.selectInput}>
                  <Text style={styles.selectText}>{gender || "Select"}</Text>
                  <Ionicons name="chevron-down" size={20} color="#9E9E9E" />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Country</Text>
                <TextInput style={styles.formInput} value={country} onChangeText={setCountry} placeholder="Sri Lanka" />
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowEditInfoModal(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={savePersonalDetails}>
                  <Text style={styles.saveButtonText}>{loading ? "Saving..." : "Save"}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal visible={showEditProfileModal} transparent animationType="slide" onRequestClose={() => setShowEditProfileModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditProfileModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.editFormScroll}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Full Name</Text>
                <TextInput style={styles.formInput} value={fullName} onChangeText={setFullName} placeholder="Your name" />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Username</Text>
                <View style={styles.usernameInputContainer}>
                  <Text style={styles.usernamePrefix}>@</Text>
                  <TextInput
                    style={[styles.usernameInput, { opacity: 0.6 }]}
                    value={username}
                    editable={false}
                    selectTextOnFocus={false}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput style={[styles.formInput, { opacity: 0.7 }]} value={email} editable={false} />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Bio</Text>
                <TextInput
                  style={[styles.formInput, styles.bioInput]}
                  value={bio}
                  onChangeText={(text) => {
                    if (text.length <= 150) setBio(text);
                  }}
                  placeholder="Tell something about you..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  maxLength={150}
                />
                <Text style={styles.charCounter}>{bio.length}/150</Text>
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowEditProfileModal(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={saveEditProfile}>
                  <Text style={styles.saveButtonText}>{loading ? "Saving..." : "Save"}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal visible={showLogoutModal} transparent animationType="fade" onRequestClose={() => setShowLogoutModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContainer}>
            <Text style={styles.confirmTitle}>Logout</Text>
            <Text style={styles.confirmMessage}>Are you sure you want to logout?</Text>

            <TouchableOpacity style={styles.confirmLogoutButton} onPress={handleLogout}>
              <Text style={styles.confirmLogoutText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmCancelButton} onPress={() => setShowLogoutModal(false)}>
              <Text style={styles.confirmCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      
    </View>
  );
}


const styles = StyleSheet.create({
  
  container: { flex: 1, backgroundColor: colors.background },

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

  backButton: { padding: 4 },

  headerTitle: { fontSize: 18, 
    fontWeight: "600", 
    color: "#000" },
    
  scrollView: { flex: 1 },

  errorBanner: {
    margin: 16,
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F44336",
  },
  errorText: { 
    color: "#F44336", 
    fontWeight: "600" },

  retryBtn: { marginTop: 8 },

  retryText: { 
    color: colors.primary, 
    fontWeight: "600" },

  profileCard: {
    backgroundColor: colors.card,
    marginBottom: 20,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.cardAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 12,
  },
  profileBio: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  editProfileButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 80,
    paddingVertical: 12,
    borderRadius: 16,
  },
  editProfileButtonText: {
    color: colors.text.light,
    fontSize: 16,
    fontWeight: "600",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
  },
  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text.primary,
  },
  statusRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusLabel: {
    fontSize: 15,
    fontWeight: "500",
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
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text.primary,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.card,
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F44336",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: "90%",
    maxHeight: "80%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
  },
  modalBody: {
    padding: 20,
  },
  statusOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  statusOptionSelected: {
    backgroundColor: colors.warmTan,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  statusOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text.primary,
  },
  editFormScroll: {
    padding: 20,
  },

  tipsScroll: {
    padding: 20,
  },
  tipItem: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
    backgroundColor: colors.cardAlt,
    padding: 16,
    borderRadius: 16,
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  gotItButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
  },
  gotItButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.light,
  },
  faqScroll: {
    padding: 20,
  },
  faqItem: {
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.cardAlt,
    borderRadius: 16,
  },
  faqQuestion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: colors.text.primary,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginTop: 8,
    paddingRight: 20,
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.light,
  },
  contactScroll: {
    padding: 20,
  },
  contactInfo: {
    gap: 12,
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderRadius: 12,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.secondary,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
  },
  contactDivider: {
    fontSize: 14,
    color: "#9E9E9E",
    textAlign: "center",
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: colors.cardAlt,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text.primary,
  },
  selectInput: {
    backgroundColor: colors.cardAlt,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    fontSize: 15,
    color: colors.text.primary,
  },
  formButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.cardAlt,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.light,
  },
  messageInput: {
    height: 120,
  },
  confirmModalContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 12,
  },
  confirmMessage: {
    fontSize: 15,
    color: colors.text.secondary,
    marginBottom: 24,
    textAlign: "center",
  },
  confirmLogoutButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  confirmLogoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F44336",
  },
  confirmCancelButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  confirmCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  photoModalContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: "90%",
    maxHeight: "40%",
    overflow: "hidden",
  },
  photoModalBody: {
    padding: 24,
    alignItems: "center",
  },
  uploadPhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 16,
    marginBottom: 16,
    width: "100%",
  },
  uploadPhotoText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.light,
  },
  uploadHint: {
    fontSize: 12,
    color: colors.text.muted,
    textAlign: "center",
  },
  usernameInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardAlt,
    borderRadius: 16,
    paddingLeft: 16,
  },
  usernamePrefix: {
    fontSize: 15,
    color: colors.text.primary,
    marginRight: 4,
  },
  usernameInput: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 16,
    fontSize: 15,
    color: colors.text.primary,
  },
  bioInput: {
    height: 120,
    paddingTop: 14,
  },
  charCounter: {
    fontSize: 12,
    color: colors.text.muted,
    textAlign: "right",
    marginTop: 4,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
});