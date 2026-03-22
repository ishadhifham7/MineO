import React, { useState } from "react";
import { useRouter } from "expo-router";
import { loginUser } from "../../src/services/auth.service";
import { useAuth } from "../../src/hooks/useAuth";
import { useAppTheme } from "../../src/design-system";
import type { AppTheme } from "../../src/design-system";

const AUTH_BUTTON_COLOR = "#8C7F6A";

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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (isSubmitting) return;

    try {
      if (!email || !password) {
        Alert.alert("Error", "Please enter email and password");
        return;
      }

      setIsSubmitting(true);

      await loginUser(email, password);

      // Refresh auth context to load user data
      await refreshAuth();

      Alert.alert("Success", "Logged in successfully");

      // navigate to main app
      router.replace("/tabs/home");
    } catch (error: any) {
      Alert.alert("Log In Failed", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Continue your progress and keep your streak alive.
            </Text>
          </View>

          <View style={styles.formCard}>
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
              placeholder="Enter your password"
              placeholderTextColor={theme.colors.textMuted}
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={theme.colors.primaryForeground} />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.footerText}>
              New to MineO?
              <Text
                style={styles.createNew}
                onPress={() => router.push("/auth/signup")}
              >
                {" "}
                Create account
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    keyboardContainer: {
      flex: 1,
    },
    container: {
      flexGrow: 1,
      paddingHorizontal: 22,
      paddingTop: 54,
      paddingBottom: 28,
      justifyContent: "center",
    },
    heroSection: {
      marginBottom: 22,
    },
    title: {
      fontSize: 36,
      fontWeight: "800",
      color: theme.colors.text,
      letterSpacing: -0.6,
    },
    subtitle: {
      marginTop: 10,
      fontSize: 15,
      lineHeight: 22,
      color: theme.colors.textMuted,
    },
    formCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 18,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 14,
      elevation: 3,
    },
    inputLabel: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.colors.textMuted,
      marginBottom: 8,
    },
    input: {
      backgroundColor: theme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 14,
      paddingVertical: 13,
      borderRadius: 12,
      marginBottom: 14,
      color: theme.colors.text,
      fontSize: 15,
    },
    button: {
      backgroundColor: AUTH_BUTTON_COLOR,
      padding: 18,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 6,
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    buttonText: {
      fontWeight: "700",
      color: theme.colors.primaryForeground,
      fontSize: 16,
      letterSpacing: 0.3,
    },
    footerText: {
      marginTop: 16,
      textAlign: "center",
      color: theme.colors.textMuted,
      fontSize: 14,
    },
    createNew: {
      color: theme.colors.text,
      fontWeight: "700",
    },
  });

export default LoginScreen;

