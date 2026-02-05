import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";

const MIN_WIDTH = 80;
const MIN_HEIGHT = 40;
const HANDLE_SIZE = 12;

type TextBlockProps = {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onTextChange: (id: string, text: string) => void;
  onResize: (
    id: string,
    width: number,
    height: number,
    x: number,
    y: number
  ) => void;
};

export function TextBlock({
  id,
  text,
  x,
  y,
  width,
  height,
  isSelected,
  onSelect,
  onMove,
  onTextChange,
  onResize,
}: TextBlockProps) {
  const posX = useSharedValue(x);
  const posY = useSharedValue(y);
  const blockWidth = useSharedValue(width);
  const blockHeight = useSharedValue(height);
  const isResizing = useSharedValue(false);

  // Track initial values for resize calculations
  const startPosX = useSharedValue(0);
  const startPosY = useSharedValue(0);
  const startWidth = useSharedValue(0);
  const startHeight = useSharedValue(0);

  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(text);
  const inputRef = useRef<TextInput>(null);

  /* ---- sync from parent ---- */
  useEffect(() => {
    posX.value = x;
    posY.value = y;
    blockWidth.value = width;
    blockHeight.value = height;
  }, [x, y, width, height]);

  useEffect(() => setLocalText(text), [text]);

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isEditing]);

  const animatedStyle = useAnimatedStyle(() => ({
    left: posX.value,
    top: posY.value,
    width: blockWidth.value,
    height: blockHeight.value,
  }));

  /* ---- move ---- */
  const panGesture = Gesture.Pan()
    .enabled(!isEditing && !isResizing.value)
    .onBegin(() => runOnJS(onSelect)(id))
    .onUpdate((e) => {
      posX.value = x + e.translationX;
      posY.value = y + e.translationY;
    })
    .onEnd(() => {
      runOnJS(onMove)(id, posX.value, posY.value);
    });

  /* ---- edit ---- */
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(onSelect)(id);
      runOnJS(setIsEditing)(true);
    });

  /* ---- resize helpers ---- */
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
      posY.value
    );
  };

  /* ---- resize gestures ---- */
  const resizeBR = Gesture.Pan()
    .onBegin(startResize)
    .onUpdate((e) => {
      blockWidth.value = Math.max(MIN_WIDTH, startWidth.value + e.translationX);
      blockHeight.value = Math.max(MIN_HEIGHT, startHeight.value + e.translationY);
    })
    .onEnd(finishResize);

  const resizeBL = Gesture.Pan()
    .onBegin(startResize)
    .onUpdate((e) => {
      const newWidth = Math.max(MIN_WIDTH, startWidth.value - e.translationX);
      const widthDiff = startWidth.value - newWidth;
      blockWidth.value = newWidth;
      posX.value = startPosX.value + widthDiff;
      blockHeight.value = Math.max(MIN_HEIGHT, startHeight.value + e.translationY);
    })
    .onEnd(finishResize);

  const resizeTR = Gesture.Pan()
    .onBegin(startResize)
    .onUpdate((e) => {
      const newHeight = Math.max(MIN_HEIGHT, startHeight.value - e.translationY);
      const heightDiff = startHeight.value - newHeight;
      blockHeight.value = newHeight;
      posY.value = startPosY.value + heightDiff;
      blockWidth.value = Math.max(MIN_WIDTH, startWidth.value + e.translationX);
    })
    .onEnd(finishResize);

  const resizeTL = Gesture.Pan()
    .onBegin(startResize)
    .onUpdate((e) => {
      const newWidth = Math.max(MIN_WIDTH, startWidth.value - e.translationX);
      const newHeight = Math.max(MIN_HEIGHT, startHeight.value - e.translationY);
      const widthDiff = startWidth.value - newWidth;
      const heightDiff = startHeight.value - newHeight;
      blockWidth.value = newWidth;
      blockHeight.value = newHeight;
      posX.value = startPosX.value + widthDiff;
      posY.value = startPosY.value + heightDiff;
    })
    .onEnd(finishResize);

  const composedGesture = Gesture.Race(doubleTapGesture, panGesture);

  const finishEditing = () => {
    setIsEditing(false);
    if (localText !== text) onTextChange(id, localText);
  };

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[styles.block, animatedStyle, isSelected && styles.selected]}
      >
        {isEditing ? (
          <TextInput
            ref={inputRef}
            value={localText}
            onChangeText={setLocalText}
            onBlur={finishEditing}
            multiline
            style={styles.input}
          />
        ) : (
          <Text style={styles.text}>{text}</Text>
        )}

        {isSelected && (
          <>
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
          </>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  block: {
    position: "absolute",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  selected: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#4A90E2",
  },
  text: {
    fontSize: 16,
    color: "#111",
  },
  input: {
    fontSize: 16,
    color: "#111",
    padding: 0,
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
});
