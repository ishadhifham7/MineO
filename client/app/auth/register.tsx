import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { signupUser } from "../../src/services/auth.service";
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

export default function SignupDetailsScreen() {
  const router = useRouter();
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
      Alert.alert("Permission required", "Please allow photo access");
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

    if (!bio) newErrors.bio = "Bio is required";
    if (!year || !month || !day) newErrors.dob = "Complete birthday selection";
    if (!gender) newErrors.gender = "Gender is required";
    if (!country) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ====================    handling signup    ==============================

  const handleSignup = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await signupUser({
        name,
        email,
        password,
        bio,
        dob: formatDate(),
        gender,
        country,
        profilePhoto: profilePhoto ?? undefined,
      });

      Alert.alert("Success", "Account created");
      router.replace("/onboarding/step1");
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message);
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
            placeholder="Enter your country"
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
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.backText} onPress={() => router.back()}>
          ← Go Back
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  avatarContainer: {
    alignSelf: "center",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  avatar: { width: "100%", height: "100%" },
  avatarPlaceholder: { fontSize: 40, color: "#999" },

  card: {
    backgroundColor: "#fafafa",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  label: {
    fontWeight: "600",
    marginBottom: 8,
    color: "#444",
  },
  input: {
    backgroundColor: "#f2f2f2",
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
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
  },

  error: {
    color: "red",
    marginBottom: 10,
    marginLeft: 4,
  },

  button: {
    backgroundColor: "#E6E26A",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 14,
  },
  buttonText: { fontWeight: "600" },

  backText: {
    marginTop: 20,
    textAlign: "center",
    color: "#555",
  },
});
