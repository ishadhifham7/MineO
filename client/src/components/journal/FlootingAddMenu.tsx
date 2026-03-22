import { Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

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
  const translateX = useSharedValue(20);

  // animate in / out — slide in from right
  if (visible) {
    opacity.value = withTiming(1, { duration: 180 });
    translateX.value = withTiming(0, { duration: 180 });
  } else {
    opacity.value = withTiming(0, { duration: 150 });
    translateX.value = withTiming(20, { duration: 150 });
  }

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
    pointerEvents: visible ? "auto" : "none",
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Add Image */}
      <Pressable style={styles.button} onPress={onAddImage}>
        <MaterialIcons name="image" size={22} color="#fff" />
      </Pressable>

      {/* Add Text */}
      <Pressable style={styles.button} onPress={onAddText}>
        <MaterialIcons name="text-fields" size={22} color="#fff" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    // Align action buttons on the same row as the main + button.
    bottom: 18,
    right: 80,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});
