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
import { useAppTheme } from "../../src/design-system";
import type { AppTheme } from "../../src/design-system";

const AUTH_BUTTON_COLOR = "#95B3D6";

const SignupScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleNext = () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }

    if (password.trim().length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters long.");
      return;
    }

    // pass data to register stage
    router.push({
      pathname: "/auth/register",
      params: {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>{"<- Back"}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Create Account</Text>

          <Text style={styles.subtitle}>
            Start your MineO journey. Set up your credentials to continue.
          </Text>

          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            placeholder="Your full name"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            placeholder="you@example.com"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            placeholder="Minimum 6 characters"
            placeholderTextColor={theme.colors.textMuted}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flexGrow: 1,
      padding: 24,
      backgroundColor: theme.colors.background,
    },
    backText: {
      marginBottom: 20,
      fontSize: 14,
      color: theme.colors.textMuted,
    },
    title: {
      fontSize: 32,
      fontWeight: "600",
      marginBottom: 10,
      color: theme.colors.text,
    },
    subtitle: {
      color: theme.colors.textMuted,
      marginBottom: 24,
    },
    inputLabel: {
      marginBottom: 8,
      color: theme.colors.text,
      fontSize: 13,
      fontWeight: "500",
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
      color: theme.colors.text,
    },
    button: {
      backgroundColor: AUTH_BUTTON_COLOR,
      padding: 18,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 16,
    },
    buttonText: {
      fontWeight: "600",
      color: theme.colors.primaryForeground,
    },
    footerText: {
      marginTop: 18,
      textAlign: "center",
      color: theme.colors.textMuted,
    },
    loginLink: {
      color: theme.colors.text,
      fontWeight: "600",
    },
  });
