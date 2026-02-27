import { View, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

type FloatingAddMenuProps = {
  visible: boolean;
  onAddText: () => void;
  onAddImage: () => void;
};

export function FloatingAddMenu({
  visible,
  onAddText,
  onAddImage,
}: FloatingAddMenuProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  // animate in / out — must run in useEffect, not during render
  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 150 });
      translateY.value = withTiming(0, { duration: 150 });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      translateY.value = withTiming(20, { duration: 150 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
    pointerEvents: visible ? "auto" : "none",
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Add Text */}
      <Pressable style={styles.button} onPress={onAddText}>
        <MaterialIcons name="text-fields" size={22} color="#fff" />
      </Pressable>

      {/* Add Image */}
      <Pressable style={styles.button} onPress={onAddImage}>
        <MaterialIcons name="image" size={22} color="#fff" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 90,
    right: 24,
    alignItems: "center",
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    elevation: 4,
  },
});
