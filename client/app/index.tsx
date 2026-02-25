import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to login after 3 seconds
    const timer = setTimeout(() => {
      router.replace("/auth/login");
    }, 3000);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* App Logo/Icon Placeholder */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>M</Text>
        </View>
      </View>

      {/* App Name */}
      <Text style={styles.appName}>MineO</Text>

      {/* Tagline */}
      <Text style={styles.tagline}>Your Personal Growth Journey</Text>

      {/* Loading Indicator */}
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>

      {/* Version */}
      <Text style={styles.version}>v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoText: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#ffffff",
  },
  appName: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 60,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  loadingContainer: {
    marginTop: 20,
  },
  version: {
    position: "absolute",
    bottom: 40,
    fontSize: 14,
    color: "#9ca3af",
  },
});
