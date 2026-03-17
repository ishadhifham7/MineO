import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d10202",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#8f0000",
  },
});

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  
    const timer = setTimeout(() => {
      router.replace("/auth/login");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
        MineO
      </Animated.Text>
    </View>
  );
}
