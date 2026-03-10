import React, { useState } from "react";
import { useRouter } from "expo-router";
import { loginUser } from "../../src/services/auth.service";
import { useAuth } from "../../src/hooks/useAuth";
import { colors } from "../../src/constants/colors";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Error", "Please enter email and password");
        return;
      }

      await loginUser(email, password);

      // Refresh auth context to load user data
      await refreshAuth();

      Alert.alert("Success", "Logged in successfully");

      // navigate to main app
      router.replace("/tabs/home");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hey,{"\n"}Login Now!</Text>

      <Text style={styles.subtitle}>
        I Am A Old User /
        <Text
          style={styles.createNew}
          onPress={() => router.push("/auth/signup")}
        >
          {" "}
          Create New
        </Text>
      </Text>

      {/*text area for email */}
      <TextInput
        placeholder="email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      {/*text area for password */}
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      {/* login button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 20,
    color: colors.text.primary,
  },
  subtitle: {
    color: colors.text.muted,
    marginBottom: 30,
    fontSize: 14,
  },
  createNew: {
    color: colors.primary,
    fontWeight: "600",
  },
  input: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    color: colors.text.primary,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 30,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 16,
    color: colors.text.light,
  },
});

export default LoginScreen;
