import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import { ImageBlock as ImageBlockType } from "../../../../types/journal";

const MIN_WIDTH = 80;
const MIN_HEIGHT = 80;
const HANDLE_SIZE = 15;

type ImageBlockProps = {
  id: string;
  imageUri: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (
    id: string,
    width: number,
    height: number,
    x: number,
    y: number,
  ) => void;
  onRotate: (id: string, rotation: number) => void;
  onLongPress: (id: string, x: number, y: number) => void;
};

export function ImageBlockComponent({
  id,
  imageUri,
  x,
  y,
  width,
  height,
  rotation,
  zIndex,
  isSelected,
  onSelect,
  onMove,
  onResize,
  onRotate,
  onLongPress,
}: ImageBlockProps) {
  const posX = useSharedValue(x);
  const posY = useSharedValue(y);
  const blockWidth = useSharedValue(width);
  const blockHeight = useSharedValue(height);
  const rotate = useSharedValue(rotation);

  const isResizing = useSharedValue(false);

  const startPosX = useSharedValue(0);
  const startPosY = useSharedValue(0);
  const startWidth = useSharedValue(0);
  const startHeight = useSharedValue(0);
  const startRotation = useSharedValue(0);

  // Sync from parent
  useEffect(() => {
    posX.value = x;
    posY.value = y;
    blockWidth.value = width;
    blockHeight.value = height;
    rotate.value = rotation;
  }, [x, y, width, height, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    left: posX.value,
    top: posY.value,
    width: blockWidth.value,
    height: blockHeight.value,
    zIndex: zIndex,
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  // Move gesture
  const panGesture = Gesture.Pan()
    .enabled(!isResizing.value)
    .minDistance(10)
    .onBegin(() => runOnJS(onSelect)(id))
    .onUpdate((e) => {
      posX.value = x + e.translationX;
      posY.value = y + e.translationY;
    })
    .onEnd(() => {
      runOnJS(onMove)(id, posX.value, posY.value);
    });

  // Long press for context menu
  const longPressGesture = Gesture.LongPress()
    .minDuration(250)
    .maxDistance(10)
    .enabled(!isResizing.value)
    .onStart((e) => {
      runOnJS(onSelect)(id);
      runOnJS(onLongPress)(id, e.absoluteX, e.absoluteY);
    });

  // Single tap for selection
  const tapGesture = Gesture.Tap().onEnd(() => {
    runOnJS(onSelect)(id);
  });

  panGesture.requireExternalGestureToFail(longPressGesture);

  // Resize helpers
  const startResize = () => {
    isResizing.value = true;
    startPosX.value = posX.value;
    startPosY.value = posY.value;
    startWidth.value = blockWidth.value;
    startHeight.value = blockHeight.value;
    runOnJS(onSelect)(id);
  };

  const finishResize = () => {
    isResizing.value = false;
    runOnJS(onResize)(
      id,
      blockWidth.value,
      blockHeight.value,
      posX.value,
      posY.value,
    );
  };

  // Resize gestures
  const resizeBR = Gesture.Pan()
    .onBegin(startResize)
    .onUpdate((e) => {
      blockWidth.value = Math.max(MIN_WIDTH, startWidth.value + e.translationX);
      blockHeight.value = Math.max(
        MIN_HEIGHT,
        startHeight.value + e.translationY,
      );
    })
    .onEnd(finishResize);

  const resizeBL = Gesture.Pan()
    .onBegin(startResize)
    .onUpdate((e) => {
      const newWidth = Math.max(MIN_WIDTH, startWidth.value - e.translationX);
      const diff = startWidth.value - newWidth;
      blockWidth.value = newWidth;
      posX.value = startPosX.value + diff;
      blockHeight.value = Math.max(
        MIN_HEIGHT,
        startHeight.value + e.translationY,
      );
    })
    .onEnd(finishResize);

  const resizeTR = Gesture.Pan()
    .onBegin(startResize)
    .onUpdate((e) => {
      const newHeight = Math.max(
        MIN_HEIGHT,
        startHeight.value - e.translationY,
      );
      const diff = startHeight.value - newHeight;
      blockHeight.value = newHeight;
      posY.value = startPosY.value + diff;
      blockWidth.value = Math.max(MIN_WIDTH, startWidth.value + e.translationX);
    })
    .onEnd(finishResize);

  const resizeTL = Gesture.Pan()
    .onBegin(startResize)
    .onUpdate((e) => {
      const newWidth = Math.max(MIN_WIDTH, startWidth.value - e.translationX);
      const newHeight = Math.max(
        MIN_HEIGHT,
        startHeight.value - e.translationY,
      );
      const wDiff = startWidth.value - newWidth;
      const hDiff = startHeight.value - newHeight;
      blockWidth.value = newWidth;
      blockHeight.value = newHeight;
      posX.value = startPosX.value + wDiff;
      posY.value = startPosY.value + hDiff;
    })
    .onEnd(finishResize);

  // Rotation gesture
  const rotateGesture = Gesture.Pan()
    .onBegin(() => {
      startRotation.value = rotate.value;
      runOnJS(onSelect)(id);
    })
    .onUpdate((e) => {
      rotate.value = startRotation.value + e.translationX * 0.4;
    })
    .onEnd(() => {
      runOnJS(onRotate)(id, rotate.value);
    });

  const composedGesture = Gesture.Race(
    longPressGesture,
    tapGesture,
    panGesture,
  );

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[styles.block, animatedStyle, isSelected && styles.selected]}
      >
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Selection handles */}
        {isSelected && (
          <>
            {/* Resize handles */}
            <GestureDetector gesture={resizeTL}>
              <View style={[styles.handle, styles.tl]} />
            </GestureDetector>
            <GestureDetector gesture={resizeTR}>
              <View style={[styles.handle, styles.tr]} />
            </GestureDetector>
            <GestureDetector gesture={resizeBL}>
              <View style={[styles.handle, styles.bl]} />
            </GestureDetector>
            <GestureDetector gesture={resizeBR}>
              <View style={[styles.handle, styles.br]} />
            </GestureDetector>

            {/* Rotation handle */}
            <GestureDetector gesture={rotateGesture}>
              <View style={styles.rotateHandle}>
                <MaterialIcons name="rotate-right" size={18} color="#4A90E2" />
              </View>
            </GestureDetector>
          </>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  block: {
    position: "absolute",
    overflow: "hidden",
  },
  selected: {
    borderWidth: 1,
    borderColor: "#4A90E2",
    borderStyle: "dashed",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  handle: {
    position: "absolute",
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    backgroundColor: "#4A90E2",
    borderRadius: HANDLE_SIZE / 2,
  },
  tl: { top: -6, left: -6 },
  tr: { top: -6, right: -6 },
  bl: { bottom: -6, left: -6 },
  br: { bottom: -6, right: -6 },
  rotateHandle: {
    position: "absolute",
    top: -30,
    left: "50%",
    marginLeft: -9,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});
