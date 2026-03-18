import React, { useState } from "react";
import { useRouter } from "expo-router";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



const SignupScreen: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleNext = () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }

    if (password.trim().length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters");
      return;
    }

    // pass data to register stage
    router.push({
      pathname: "/auth/register",
      params: { name: name.trim(), email: email.trim(), password: password.trim() },
    });
  };


  return(
    <View style={styles.container}>

      {/* Go back button */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backText}>{"<- Go Back"}</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Create{"\n"}Account</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Already have an account?
        <Text
          style={styles.createNew}
          onPress={() => router.replace("/auth/login")}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.heroSection}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Start your MineO journey. Set up your credentials to continue.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              placeholder="Your full name"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              placeholder="you@example.com"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              placeholder="Minimum 6 characters"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              Already have an account?
              <Text
                style={styles.loginLink}
                onPress={() => router.replace("/auth/login")}
              >
                {" "}
                Login
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: "#fff",
      justifyContent: "center",
    },
    backText: {
      marginBottom: 20,
      fontSize: 14,
      color: "#555",
    },
    title: {
      fontSize: 32,
      fontWeight: "600",
      marginBottom: 20,
    },
    subtitle: {
      color: "#777",
      marginBottom: 30,
    },
    createNew: {
      color: "#000",
      fontWeight: "600",
    },
    input: {
      backgroundColor: "#f2f2f2",
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
    },
    button: {
      backgroundColor: "#A7C4E8",
      padding: 18,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 30,
    },
    buttonText: {
      fontWeight: "600",
    },
});
