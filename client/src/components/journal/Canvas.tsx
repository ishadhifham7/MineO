import React, { ReactNode, useEffect, useRef } from "react";
import {
  ScrollView,
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
  const horizontalScrollRef = useRef<ScrollView>(null);
  const verticalScrollRef = useRef<ScrollView>(null);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 3;

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      let nextScale = savedScale.value * e.scale;

      if (nextScale < MIN_SCALE) nextScale = MIN_SCALE;
      if (nextScale > MAX_SCALE) nextScale = MAX_SCALE;

      scale.value = nextScale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  // Long-press on empty canvas — must be OUTSIDE ScrollViews so the scroll
  // responder doesn't cancel it before 400ms is reached.
  const longPressGesture = Gesture.LongPress()
    .minDuration(400)
    .maxDistance(10)
    .onStart((e) => {
      if (onCanvasLongPress) {
        runOnJS(onCanvasLongPress)(e.x, e.y);
      }
    });

  const animatedCanvasStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    // Center canvas on first mount
    requestAnimationFrame(() => {
      horizontalScrollRef.current?.scrollTo({
        x: CANVAS_SIZE / 2 - width / 2,
        animated: false,
      });
      verticalScrollRef.current?.scrollTo({
        y: CANVAS_SIZE / 2 - height / 2,
        animated: false,
      });
    });
  }, []);

  // --- FIX: Make both scroll directions always available ---
  // Long press wraps the OUTER view so ScrollViews can't cancel it.
  return (
    <GestureDetector gesture={longPressGesture}>
      <View style={{ flex: 1, overflow: "hidden" }}>
        <ScrollView
          ref={verticalScrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ minHeight: CANVAS_SIZE }}
          showsVerticalScrollIndicator
          scrollEventThrottle={16}
          bounces
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          horizontal={false}
        >
          <ScrollView
            ref={horizontalScrollRef}
            horizontal
            contentContainerStyle={{ minWidth: CANVAS_SIZE }}
            showsHorizontalScrollIndicator
            scrollEventThrottle={16}
            bounces
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="none"
          >
            <GestureDetector gesture={pinchGesture}>
              <Animated.View style={[styles.canvas, animatedCanvasStyle]}>
                {/* Overlay Pressable to detect empty canvas taps */}
                {onCanvasPress && (
                  <View
                    style={StyleSheet.absoluteFill}
                    pointerEvents="box-none"
                  >
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
            </GestureDetector>
          </ScrollView>
        </ScrollView>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  verticalContent: {
    flexGrow: 1,
  },
  horizontalContent: {
    flexGrow: 1,
  },
  canvas: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    backgroundColor: "#f9f9f9",
    position: "relative",
  },
  gridLine: {
    position: "absolute",
    backgroundColor: "#e0e0e0",
  },
});
