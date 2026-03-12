import React, { ReactNode } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Pressable,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const CANVAS_SIZE = 4000;

// Center the canvas on first render
const INITIAL_X = -(CANVAS_SIZE / 2 - width / 2);
const INITIAL_Y = -(CANVAS_SIZE / 2 - height / 2);

type CanvasProps = {
  children?: ReactNode;
  onCanvasPress?: () => void;
  onCanvasLongPress?: (x: number, y: number) => void;
};

export function Canvas({
  children,
  onCanvasPress,
  onCanvasLongPress,
}: CanvasProps) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const translateX = useSharedValue(INITIAL_X);
  const translateY = useSharedValue(INITIAL_Y);
  const savedX = useSharedValue(INITIAL_X);
  const savedY = useSharedValue(INITIAL_Y);

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 3;

  // Pan — free 2D movement, clamped so canvas edges stay visible
  const panGesture = Gesture.Pan()
    .onStart(() => {
      savedX.value = translateX.value;
      savedY.value = translateY.value;
    })
    .onUpdate((e) => {
      "worklet";
      const minX = -(CANVAS_SIZE * scale.value - width);
      const minY = -(CANVAS_SIZE * scale.value - height);
      translateX.value = Math.min(0, Math.max(minX, savedX.value + e.translationX));
      translateY.value = Math.min(0, Math.max(minY, savedY.value + e.translationY));
    });

  // Pinch to zoom
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      "worklet";
      let next = savedScale.value * e.scale;
      if (next < MIN_SCALE) next = MIN_SCALE;
      if (next > MAX_SCALE) next = MAX_SCALE;
      scale.value = next;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  // Long-press on empty canvas (screen-space coords → ContextMenu overlay)
  const longPressGesture = Gesture.LongPress()
    .minDuration(400)
    .maxDistance(10)
    .onStart((e) => {
      if (onCanvasLongPress) {
        runOnJS(onCanvasLongPress)(e.x, e.y);
      }
    });

  // Pan + Pinch run simultaneously; LongPress races and fails on movement
  const composed = Gesture.Race(
    longPressGesture,
    Gesture.Simultaneous(panGesture, pinchGesture),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={composed}>
      <View style={styles.viewport}>
        <Animated.View style={[styles.canvas, animatedStyle]}>
          {/* Overlay Pressable to detect empty canvas taps */}
          {onCanvasPress && (
            <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
              <Pressable
                style={{ flex: 1 }}
                onPress={onCanvasPress}
                android_ripple={{ color: "#00000010" }}
                hitSlop={8}
              />
            </View>
          )}
          {/* Blocks live here */}
          {children}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  viewport: {
    flex: 1,
    overflow: "hidden",
  },
  canvas: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    backgroundColor: "#f9f9f9",
    position: "absolute",
  },
});
