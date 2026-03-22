import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { signupUser } from "../../src/services/auth.service";
import { useAuth } from "../../src/hooks/useAuth";
import * as ImagePicker from "expo-image-picker";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import { useAppTheme } from "../../src/design-system";
import type { AppTheme } from "../../src/design-system";

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const AUTH_BUTTON_COLOR = "#8C7F6A";

export default function SignupDetailsScreen() {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const params = useLocalSearchParams();

  const { name, email, password } = params as {
    name: string;
    email: string;
    password: string;
  };

  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Date of birth values
  const [day, setDay] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const years = Array.from(
    { length: 80 },
    (_, i) => new Date().getFullYear() - i,
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const formatDate = () => {
    if (!year || !month || !day) return "";
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  // image picker
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Please allow photo library access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const validate = () => {
    let newErrors: any = {};

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Only date of birth is required - other fields are optional
    if (!year || !month || !day) {
      newErrors.dob = "Please select your date of birth";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ====================    handling signup    ==============================

  const handleSignup = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const signupData: any = {
        name,
        email,
        password,
        dob: formatDate(),
      };

      // Only add optional fields if they have values
      if (bio && bio.trim()) signupData.bio = bio.trim();
      if (gender && gender.trim()) signupData.gender = gender.trim();
      if (country && country.trim()) signupData.country = country.trim();
      if (profilePhoto) signupData.profilePhoto = profilePhoto;

      console.log("Sending signup data:", { ...signupData, password: "***" });

      await signupUser(signupData);

      // Prevent UI from getting stuck if auth refresh is slow.
      await Promise.race([
        refreshAuth().catch((err) => {
          console.warn("Auth refresh after signup failed:", err);
        }),
        wait(2500),
      ]);

      Alert.alert("Success", "Account created successfully");
      router.replace("/onboarding/step1");
    } catch (error: any) {
      console.error("Signup failed:", error);
      Alert.alert("Sign Up Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>More About You</Text>

        {/* Avatar */}
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto }} style={styles.avatar} />
          ) : (
            <Text style={styles.avatarPlaceholder}>+</Text>
          )}
        </TouchableOpacity>

        {/* Bio container */}
        <View style={styles.card}>
          <Text style={styles.label}>Bio / Description</Text>
          <TextInput
            placeholder="Tell us about yourself"
            style={styles.input}
            value={bio}
            onChangeText={setBio}
            multiline
          />
        </View>
        {errors.bio && <Text style={styles.error}>{errors.bio}</Text>}

        {/* DOB container */}
        <View style={styles.card}>
          <Text style={styles.label}>Date of Birth</Text>

          <View style={styles.dobRow}>
            <View style={styles.dobPicker}>
              <Picker<number | null>
                selectedValue={day}
                onValueChange={(v: number | null) => setDay(v)}
              >
                <Picker.Item label="Day" value={null} />
                {days.map((d) => (
                  <Picker.Item key={d} label={String(d)} value={d} />
                ))}
              </Picker>
            </View>

            <View style={styles.dobPicker}>
              <Picker<number | null>
                selectedValue={month}
                onValueChange={(v: number | null) => setMonth(v)}
              >
                <Picker.Item label="Month" value={null} />
                {months.map((m) => (
                  <Picker.Item key={m} label={String(m)} value={m} />
                ))}
              </Picker>
            </View>

            <View style={styles.dobPicker}>
              <Picker<number | null>
                selectedValue={year}
                onValueChange={(v: number | null) => setYear(v)}
              >
                <Picker.Item label="Year" value={null} />
                {years.map((y) => (
                  <Picker.Item key={y} label={String(y)} value={y} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
        {errors.dob && <Text style={styles.error}>{errors.dob}</Text>}

        {/* Gender container */}
        <View style={styles.card}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker<string>
              selectedValue={gender}
              onValueChange={(v: string) => setGender(v)}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
          </View>
        </View>
        {errors.gender && <Text style={styles.error}>{errors.gender}</Text>}

        {/* Country container */}
        <View style={styles.card}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            placeholder="Enter your country name"
            style={styles.input}
            value={country}
            onChangeText={setCountry}
          />
        </View>
        {errors.country && <Text style={styles.error}>{errors.country}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.primaryForeground} />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.backText} onPress={() => router.back()}>
          {"<- Back"}
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      padding: 24,
      backgroundColor: theme.colors.background,
      flexGrow: 1,
    },
    title: {
      fontSize: 28,
      fontWeight: "600",
      marginBottom: 16,
      textAlign: "center",
      color: theme.colors.text,
    },
    avatarContainer: {
      alignSelf: "center",
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.surfaceAlt,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 24,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    avatar: { width: "100%", height: "100%" },
    avatarPlaceholder: { fontSize: 40, color: theme.colors.textMuted },

    card: {
      backgroundColor: theme.colors.surface,
      padding: 14,
      borderRadius: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    label: {
      fontWeight: "600",
      marginBottom: 8,
      color: theme.colors.text,
    },
    input: {
      backgroundColor: theme.colors.surfaceAlt,
      color: theme.colors.text,
      padding: 14,
      borderRadius: 10,
    },

    dobRow: {
      flexDirection: "row",
    },
    dobPicker: {
      flex: 1,
    },

    pickerContainer: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: 10,
    },

    error: {
      color: theme.colors.danger,
      marginBottom: 10,
      marginLeft: 4,
    },

    button: {
      backgroundColor: AUTH_BUTTON_COLOR,
      padding: 18,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 14,
    },
    buttonText: { fontWeight: "600", color: theme.colors.primaryForeground },

    backText: {
      marginTop: 20,
      textAlign: "center",
      color: theme.colors.textMuted,
    },
  });

