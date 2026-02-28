import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

// Activity Status Type
type ActivityStatus = "Active" | "Away" | "Offline";

export default function ProfileScreen() {
  const router = useRouter();
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

  // Theme state
  const [theme, setTheme] = useState<"Light" | "Dark" | "Auto">("Light");

  // Edit Profile form state
  const [fullName, setFullName] = useState("Omar");
  const [username, setUsername] = useState("omar_dev");
  const [email, setEmail] = useState("omar@example.com");
  const [bio, setBio] = useState("Designer & developer. Love creating beautiful experiences.");

  // Edit form state (Personal Details)
  const [phoneNumber, setPhoneNumber] = useState("+1 (555) 123-4567");
  const [birthday, setBirthday] = useState("05/15/1990");
  const [gender, setGender] = useState("Male");
  const [country, setCountry] = useState("United States");

  // Contact form state
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  // FAQ state
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

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

  const handleLogout = () => {
    setShowLogoutModal(false);
    // Add logout logic here
    router.replace("/auth/login");
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
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => setShowPhotoModal(true)}
          >
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color="#9E9E9E" />
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>{fullName}</Text>
          <Text style={styles.profileUsername}>@{username}</Text>
          <Text style={styles.profileBio}>{bio}</Text>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => setShowEditProfileModal(true)}
          >
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Activity Status */}
        <TouchableOpacity
          style={styles.statusRow}
          onPress={() => setShowActivityModal(true)}
        >
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

        {/* Account Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT MANAGEMENT</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowEditInfoModal(true)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="person-outline" size={24} color="#000" />
              <Text style={styles.menuText}>Personal Details</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/other/account-settings")}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="settings-outline" size={24} color="#000" />
              <Text style={styles.menuText}>Account Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/other/preferences")}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="color-palette-outline" size={24} color="#000" />
              <Text style={styles.menuText}>Language & Theme</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
          </TouchableOpacity>
        </View>

        {/* Need Help Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NEED HELP?</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowTipsModal(true)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="bulb-outline" size={24} color="#000" />
              <Text style={styles.menuText}>Tips and Tricks</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowFAQModal(true)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="help-circle-outline" size={24} color="#000" />
              <Text style={styles.menuText}>Frequently Asked Questions</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowContactModal(true)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="mail-outline" size={24} color="#000" />
              <Text style={styles.menuText}>Contact Us</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setShowLogoutModal(true)}
        >
          <Ionicons name="log-out-outline" size={20} color="#F44336" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Activity Status Modal */}
      <Modal
        visible={showActivityModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActivityModal(false)}
      >
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
                  style={[
                    styles.statusOption,
                    activityStatus === status && styles.statusOptionSelected,
                  ]}
                  onPress={() => {
                    setActivityStatus(status);
                    setShowActivityModal(false);
                  }}
                >
                  <View style={styles.statusOptionLeft}>
                    <View
                      style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]}
                    />
                    <Text style={styles.statusOptionText}>{status}</Text>
                  </View>
                  {activityStatus === status && (
                    <Ionicons name="checkmark" size={24} color="#2196F3" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Information Modal */}
      <Modal
        visible={showEditInfoModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditInfoModal(false)}
      >
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
                <TextInput
                  style={styles.formInput}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="+1 (555) 123-4567"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Birthday</Text>
                <TextInput
                  style={styles.formInput}
                  value={birthday}
                  onChangeText={setBirthday}
                  placeholder="05/15/1990"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Gender</Text>
                <View style={styles.selectInput}>
                  <Text style={styles.selectText}>{gender}</Text>
                  <Ionicons name="chevron-down" size={20} color="#9E9E9E" />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Country</Text>
                <TextInput
                  style={styles.formInput}
                  value={country}
                  onChangeText={setCountry}
                  placeholder="United States"
                />
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowEditInfoModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => setShowEditInfoModal(false)}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Tips and Tricks Modal */}
      <Modal
        visible={showTipsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTipsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tips and Tricks</Text>
              <TouchableOpacity onPress={() => setShowTipsModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.tipsScroll}>
              <View style={styles.tipItem}>
                <View style={[styles.tipIcon, { backgroundColor: "#E3F2FD" }]}>
                  <Ionicons name="bulb-outline" size={24} color="#2196F3" />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Complete Your Profile</Text>
                  <Text style={styles.tipDescription}>
                    Add all your personal details to make your profile stand out and help others
                    connect with you.
                  </Text>
                </View>
              </View>

              <View style={styles.tipItem}>
                <View style={[styles.tipIcon, { backgroundColor: "#FFF3E0" }]}>
                  <Ionicons name="flash-outline" size={24} color="#FF9800" />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Update Your Status</Text>
                  <Text style={styles.tipDescription}>
                    Keep your activity status current so others know when you're available to
                    connect.
                  </Text>
                </View>
              </View>

              <View style={styles.tipItem}>
                <View style={[styles.tipIcon, { backgroundColor: "#F3E5F5" }]}>
                  <Ionicons name="radio-button-on-outline" size={24} color="#9C27B0" />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Personalize Your Theme</Text>
                  <Text style={styles.tipDescription}>
                    Choose your preferred theme and language in the settings to customize your
                    experience.
                  </Text>
                </View>
              </View>

              <View style={styles.tipItem}>
                <View style={[styles.tipIcon, { backgroundColor: "#E8F5E9" }]}>
                  <Ionicons name="shield-checkmark-outline" size={24} color="#4CAF50" />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Stay Secure</Text>
                  <Text style={styles.tipDescription}>
                    Review your privacy settings regularly to ensure your account is protected.
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.gotItButton}
                onPress={() => setShowTipsModal(false)}
              >
                <Text style={styles.gotItButtonText}>Got it!</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* FAQ Modal */}
      <Modal
        visible={showFAQModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFAQModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Frequently Asked Questions</Text>
              <TouchableOpacity onPress={() => setShowFAQModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.faqScroll}>
              {[
                {
                  question: "How do I update my profile information?",
                  answer:
                    "Go to Personal Details in Account Management to update your profile information.",
                },
                {
                  question: "How can I change my profile photo?",
                  answer:
                    "Tap on your profile picture and select 'Change Photo' to upload a new image.",
                },
                {
                  question: "What does the activity status mean?",
                  answer:
                    "Activity status shows whether you're Active, Away, or Offline to other users.",
                },
                {
                  question: "How do I change the app theme?",
                  answer:
                    "Navigate to Language & Theme in Account Management to switch between Light, Dark, or Auto theme.",
                },
                {
                  question: "Is my personal information secure?",
                  answer:
                    "Yes, we use industry-standard encryption to protect your data. Review privacy settings for more control.",
                },
                {
                  question: "How do I delete my account?",
                  answer:
                    "Go to Account Settings > Privacy > Delete Account. This action is permanent.",
                },
              ].map((faq, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.faqItem}
                  onPress={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                >
                  <View style={styles.faqQuestion}>
                    <Text style={styles.faqQuestionText}>{faq.question}</Text>
                    <Ionicons
                      name={expandedFAQ === index ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#9E9E9E"
                    />
                  </View>
                  {expandedFAQ === index && (
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  )}
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowFAQModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Contact Us Modal */}
      <Modal
        visible={showContactModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowContactModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contact Us</Text>
              <TouchableOpacity onPress={() => setShowContactModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.contactScroll}>
              <View style={styles.contactInfo}>
                <View style={[styles.contactItem, { backgroundColor: "#E3F2FD" }]}>
                  <Ionicons name="mail" size={24} color="#2196F3" />
                  <View style={styles.contactTextContainer}>
                    <Text style={styles.contactLabel}>Email</Text>
                    <Text style={styles.contactValue}>support@example.com</Text>
                  </View>
                </View>

                <View style={[styles.contactItem, { backgroundColor: "#E8F5E9" }]}>
                  <Ionicons name="call" size={24} color="#4CAF50" />
                  <View style={styles.contactTextContainer}>
                    <Text style={styles.contactLabel}>Phone</Text>
                    <Text style={styles.contactValue}>+1 (555) 123-4567</Text>
                  </View>
                </View>

                <View style={[styles.contactItem, { backgroundColor: "#F3E5F5" }]}>
                  <Ionicons name="chatbubble-ellipses" size={24} color="#9C27B0" />
                  <View style={styles.contactTextContainer}>
                    <Text style={styles.contactLabel}>Live Chat</Text>
                    <Text style={styles.contactValue}>Available 24/7</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.contactDivider}>Or send us a message</Text>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Subject</Text>
                <TextInput
                  style={styles.formInput}
                  value={contactSubject}
                  onChangeText={setContactSubject}
                  placeholder="How can we help you?"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Message</Text>
                <TextInput
                  style={[styles.formInput, styles.messageInput]}
                  value={contactMessage}
                  onChangeText={setContactMessage}
                  placeholder="Tell us more about your inquiry..."
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowContactModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    setShowContactModal(false);
                    setContactSubject("");
                    setContactMessage("");
                  }}
                >
                  <Text style={styles.saveButtonText}>Send Message</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContainer}>
            <Text style={styles.confirmTitle}>Logout</Text>
            <Text style={styles.confirmMessage}>Are you sure you want to logout?</Text>

            <TouchableOpacity style={styles.confirmLogoutButton} onPress={handleLogout}>
              <Text style={styles.confirmLogoutText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmCancelButton}
              onPress={() => setShowLogoutModal(false)}
            >
              <Text style={styles.confirmCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Profile Photo Modal */}
      <Modal
        visible={showPhotoModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.photoModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Profile Photo</Text>
              <TouchableOpacity onPress={() => setShowPhotoModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.photoModalBody}>
              <TouchableOpacity
                style={styles.uploadPhotoButton}
                onPress={() => {
                  // Handle photo upload
                  setShowPhotoModal(false);
                }}
              >
                <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
                <Text style={styles.uploadPhotoText}>Upload Photo</Text>
              </TouchableOpacity>

              <Text style={styles.uploadHint}>
                Supported formats: JPG, PNG, GIF. Max size: 5MB
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfileModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditProfileModal(false)}
      >
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
                <TextInput
                  style={styles.formInput}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Omar"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Username</Text>
                <View style={styles.usernameInputContainer}>
                  <Text style={styles.usernamePrefix}>@</Text>
                  <TextInput
                    style={styles.usernameInput}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="omar_dev"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  style={styles.formInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="omar@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Bio</Text>
                <TextInput
                  style={[styles.formInput, styles.bioInput]}
                  value={bio}
                  onChangeText={(text) => {
                    if (text.length <= 150) {
                      setBio(text);
                    }
                  }}
                  placeholder="Designer & developer. Love creating beautiful experiences."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  maxLength={150}
                />
                <Text style={styles.charCounter}>{bio.length}/150</Text>
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowEditProfileModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    // Save profile changes
                    setShowEditProfileModal(false);
                  }}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: "#fff",
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
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 14,
    color: "#2196F3",
    marginBottom: 12,
  },
  profileBio: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  editProfileButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 80,
    paddingVertical: 12,
    borderRadius: 25,
  },
  editProfileButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
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
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
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
    color: "#9E9E9E",
    paddingHorizontal: 20,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 8,
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
    backgroundColor: "#fff",
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
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
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
    borderRadius: 12,
    marginBottom: 8,
  },
  statusOptionSelected: {
    backgroundColor: "#E3F2FD",
    borderWidth: 2,
    borderColor: "#2196F3",
  },
  statusOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  editFormScroll: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#000",
  },
  selectInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    fontSize: 15,
    color: "#000",
  },
  formButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#757575",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#2196F3",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  tipsScroll: {
    padding: 20,
  },
  tipItem: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 12,
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
    color: "#000",
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: "#757575",
    lineHeight: 20,
  },
  gotItButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 12,
  },
  gotItButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  faqScroll: {
    padding: 20,
  },
  faqItem: {
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
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
    color: "#000",
  },
  faqAnswer: {
    fontSize: 14,
    color: "#757575",
    lineHeight: 20,
    marginTop: 8,
    paddingRight: 20,
  },
  closeButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 12,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
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
    color: "#757575",
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  contactDivider: {
    fontSize: 14,
    color: "#9E9E9E",
    textAlign: "center",
    marginBottom: 20,
  },
  messageInput: {
    height: 120,
  },
  confirmModalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
  },
  confirmMessage: {
    fontSize: 15,
    color: "#757575",
    marginBottom: 24,
    textAlign: "center",
  },
  confirmLogoutButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
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
    borderRadius: 8,
    alignItems: "center",
  },
  confirmCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2196F3",
  },
  photoModalContainer: {
    backgroundColor: "#fff",
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
    backgroundColor: "#2196F3",
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
  },
  uploadPhotoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  uploadHint: {
    fontSize: 12,
    color: "#9E9E9E",
    textAlign: "center",
  },
  usernameInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingLeft: 16,
  },
  usernamePrefix: {
    fontSize: 15,
    color: "#000",
    marginRight: 4,
  },
  usernameInput: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 16,
    fontSize: 15,
    color: "#000",
  },
  bioInput: {
    height: 120,
    paddingTop: 14,
  },
  charCounter: {
    fontSize: 12,
    color: "#9E9E9E",
    textAlign: "right",
    marginTop: 4,
  },
});
