import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { useAppTheme } from "../src/design-system";
import { useAuth } from "../src/hooks/useAuth";

export default function SplashScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { isAuthenticated, isLoading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) return;

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      router.replace(isAuthenticated ? "/tabs/home" : "/auth/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, isAuthenticated, isLoading, router]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Animated.Text
        style={[styles.text, { color: theme.colors.text, opacity: fadeAnim }]}
      >
        MineO
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
  },
});
