import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Video, ResizeMode } from "expo-av";

export default function SplashScreen() {
  const router = useRouter();
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/auth/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require("../assets/0220.mp4")} 
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: 200,
    height: 200,
  },
});