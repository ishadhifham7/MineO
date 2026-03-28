import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";

const MIN_WIDTH = 80;
const MIN_HEIGHT = 40;
const HANDLE_SIZE = 10;

type TextBlockProps = {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  isSelected: boolean;
  zIndex: number;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  textColor: string;
  textAlign: "left" | "center" | "right";
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onTextChange: (id: string, text: string) => void;
  onResize: (
    id: string,
    width: number,
    height: number,
    x: number,
    y: number,
  ) => void;
  onRotate: (id: string, rotation: number) => void; // already present
  onLongPress: (id: string, x: number, y: number) => void;
};

export function TextBlock({
  id,
  text,
  x,
  y,
  width,
  height,
  rotation,
  fontSize,
  lineHeight,
  letterSpacing,
  isSelected,
  zIndex,
  isBold,
  isItalic,
  isUnderline,
  textColor,
  textAlign,
  onSelect,
  onMove,
  onTextChange,
  onResize,
  onRotate,
  onLongPress,
}: TextBlockProps) {
  const posX = useSharedValue(x);
  const posY = useSharedValue(y);
  const blockWidth = useSharedValue(width);
  const blockHeight = useSharedValue(height);

  const rotate = useSharedValue(rotation); // ✅ NEW

  const isResizing = useSharedValue(false);
  // Separate React state for .enabled() — shared values must not be read during render
  const [isResizingState, setIsResizingState] = useState(false);

  const startPosX = useSharedValue(0);
  const startPosY = useSharedValue(0);
  const startWidth = useSharedValue(0);
  const startHeight = useSharedValue(0);
  const startRotation = useSharedValue(0); // ✅ NEW

  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(text);
  const inputRef = useRef<TextInput>(null);

  /*const textStyle = {
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    color: style.color,
    textAlign: style.textAlign,
  };*/

  /* ---- sync from parent ---- */
  useEffect(() => {
    posX.value = x;
    posY.value = y;
    blockWidth.value = width;
    blockHeight.value = height;
    rotate.value = rotation; // ✅ NEW
  }, [x, y, width, height, rotation]);

  useEffect(() => setLocalText(text), [text]);

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isEditing]);

  // If block is deselected by tapping canvas, exit edit mode and close keyboard.
  useEffect(() => {
    if (!isSelected && isEditing) {
      inputRef.current?.blur();
      Keyboard.dismiss();
    }
  }, [isSelected, isEditing]);

  const animatedStyle = useAnimatedStyle(() => ({
    left: posX.value,
    top: posY.value,
    width: blockWidth.value,
    height: blockHeight.value,
    zIndex: zIndex,
    transform: [{ rotate: `${rotate.value}deg` }], // ✅ NEW
  }));

  /* ---- move ---- */
  const panGesture = Gesture.Pan()
    .enabled(!isEditing && !isResizingState)
    .minDistance(10)
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

  /* ---- long press for context menu ---- */
  const longPressGesture = Gesture.LongPress()
    .minDuration(250)
    .maxDistance(10)
    .enabled(!isEditing && !isResizingState)
    .onStart((e) => {
      runOnJS(onSelect)(id);
      runOnJS(onLongPress)(id, e.absoluteX, e.absoluteY);
    });

  // Pan should wait for long press to fail
  panGesture.requireExternalGestureToFail(longPressGesture);

  /* ---- resize helpers (UNCHANGED) ---- */
  const startResize = () => {
    isResizing.value = true;
    setIsResizingState(true);
    startPosX.value = posX.value;
    startPosY.value = posY.value;
    startWidth.value = blockWidth.value;
    startHeight.value = blockHeight.value;
    runOnJS(onSelect)(id);
  };

  const finishResize = () => {
    isResizing.value = false;
    setIsResizingState(false);
    runOnJS(onResize)(
      id,
      blockWidth.value,
      blockHeight.value,
      posX.value,
      posY.value,
    );
  };

  /* ---- resize gestures (UNCHANGED) ---- */
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

  /* ---- rotation gesture (NEW, isolated) ---- */
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
    doubleTapGesture,
    longPressGesture,
    panGesture,
  );

  const finishEditing = () => {
    setIsEditing(false);
    if (localText !== text) onTextChange(id, localText);
  };

  const computedTextStyle: TextStyle = {
    fontSize,
    lineHeight,
    letterSpacing,
    fontWeight: isBold ? "bold" : "normal",
    fontStyle: isItalic ? "italic" : "normal",
    textDecorationLine: isUnderline ? "underline" : "none",
    color: textColor,
    textAlign,
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
            style={[styles.input, computedTextStyle]}
          />
        ) : (
          <Text style={[styles.text, computedTextStyle]}>{text}</Text>
        )}

        {isSelected && (
          <>
            {/* resize handles (UNCHANGED) */}
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

            {/* rotation handle (NEW) */}
            <GestureDetector gesture={rotateGesture}>
              <View style={styles.rotateHandle}>
                <MaterialIcons name="sync" size={18} color="#4A90E2" />
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
    padding: 12,
    backgroundColor: "transparent",
    borderRadius: 8,
  },
  selected: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#4A90E2",
  },
  text: {
    color: "#111",
  },
  input: {
    padding: 0,
    color: "#221010",
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

  /* NEW */
  rotateHandle: {
    position: "absolute",
    top: -30, // move further above the block
    left: "50%",
    marginLeft: -9, // half of new width
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,

    // No overflow hidden here
  },
});
