import React, { useCallback, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  TextStyle,
  ScrollView,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { JournalEntryWithBlocks } from "../../../features/journal/journal.types";
import type {
  TextBlock as TextBlockType,
  ImageBlock as ImageBlockType,
} from "../../../../types/journal";

// ---- constants -------------------------------------------------------------

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const VIEWER_PADDING = 32;
// Extra scrollable space appended beyond the content bounding box so the user
// can freely pan around without hitting a hard wall immediately.
const CANVAS_EXTRA = 600;
const MIN_SCALE = 0.3;
const MAX_SCALE = 3;

// ---- helpers ---------------------------------------------------------------

function clamp(val: number, min: number, max: number): number {
  "worklet";
  return Math.min(Math.max(val, min), max);
}

function computeBoundingBox(blocks: JournalEntryWithBlocks["blocks"]) {
  if (blocks.length === 0) {
    return {
      minX: 0,
      minY: 0,
      contentWidth: SCREEN_WIDTH,
      contentHeight: 400,
    };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  blocks.forEach((b) => {
    minX = Math.min(minX, b.x);
    minY = Math.min(minY, b.y);
    maxX = Math.max(maxX, b.x + b.width);
    maxY = Math.max(maxY, b.y + b.height);
  });

  return {
    minX: minX - VIEWER_PADDING,
    minY: minY - VIEWER_PADDING,
    contentWidth: maxX - minX + VIEWER_PADDING * 2,
    contentHeight: maxY - minY + VIEWER_PADDING * 2,
  };
}

// ---- types -----------------------------------------------------------------

interface Props {
  visible: boolean;
  entry: JournalEntryWithBlocks | null;
  onClose: () => void;
}

// ---- component -------------------------------------------------------------

export default function JournalViewerModal({ visible, entry, onClose }: Props) {
  const insets = useSafeAreaInsets();

  // Modal slide-up uses RN Animated (not Reanimated) — kept separate
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Native ScrollView refs — handle horizontal + vertical pan exactly like Canvas.tsx
  const horizontalScrollRef = useRef<ScrollView>(null);
  const verticalScrollRef = useRef<ScrollView>(null);

  // Pinch zoom — Reanimated shared values (same as Canvas.tsx)
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  // Called from worklet via runOnJS to reset scroll position
  const scrollToCenter = useCallback(() => {
    const half = CANVAS_EXTRA / 2;
    horizontalScrollRef.current?.scrollTo({ x: half, animated: true });
    verticalScrollRef.current?.scrollTo({ y: half, animated: true });
  }, []);

  // Reset zoom + scroll whenever a new entry opens
  useEffect(() => {
    if (visible) {
      scale.value = 1;
      savedScale.value = 1;

      // Slide modal in
      slideAnim.setValue(SCREEN_HEIGHT);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          bounciness: 3,
          speed: 14,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Scroll so content is centered in the viewport after the modal settles
        requestAnimationFrame(() => {
          const half = CANVAS_EXTRA / 2;
          horizontalScrollRef.current?.scrollTo({ x: half, animated: false });
          verticalScrollRef.current?.scrollTo({ y: half, animated: false });
        });
      });
    }
  }, [visible, entry?.id]);

  const handleClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  }, [slideAnim, fadeAnim, onClose]);

  // ---- gestures ------------------------------------------------------------

  // Pinch to zoom — same implementation as Canvas.tsx
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = clamp(savedScale.value * e.scale, MIN_SCALE, MAX_SCALE);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  // Double-tap — spring scale back to 1:1 and scroll to origin
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(300)
    .onEnd(() => {
      scale.value = withSpring(1, { damping: 14, stiffness: 120 });
      savedScale.value = 1;
      runOnJS(scrollToCenter)();
    });

  // Double-tap has exclusion priority over pinch — they are distinct gestures
  // so they will not interfere with normal single-finger scrolling.
  const composed = Gesture.Exclusive(doubleTap, pinchGesture);

  const canvasAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // ---- render --------------------------------------------------------------

  if (!entry) return null;

  const sortedBlocks = [...entry.blocks].sort((a, b) => a.zIndex - b.zIndex);
  const { minX, minY, contentWidth, contentHeight } =
    computeBoundingBox(sortedBlocks);

  // Canvas dimensions: content bounding box + generous extra space to pan into,
  // mirroring the approach used in Canvas.tsx (which uses a fixed 4000×4000 space).
  const canvasWidth = Math.max(contentWidth, SCREEN_WIDTH) + CANVAS_EXTRA;
  const canvasHeight = Math.max(contentHeight, 300) + CANVAS_EXTRA;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          {
            paddingBottom: insets.bottom + 8,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Drag handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.titleText} numberOfLines={2}>
            {entry.title?.trim() || "Untitled"}
          </Text>
          <TouchableOpacity
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={26} color="#B5A993" />
          </TouchableOpacity>
        </View>

        {/* Hint */}
        <Text style={styles.hint}>
          Pinch to zoom · scroll to pan · double-tap to reset
        </Text>

        {/* ----------------------------------------------------------------
            Viewport — nested ScrollViews handle horizontal + vertical pan
            (identical pattern to Canvas.tsx); GestureDetector handles pinch
            zoom and double-tap reset.
        ---------------------------------------------------------------- */}
        <View style={styles.viewport}>
          {/* Vertical pan */}
          <ScrollView
            ref={verticalScrollRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ minHeight: canvasHeight }}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            bounces
            keyboardShouldPersistTaps="handled"
          >
            {/* Horizontal pan */}
            <ScrollView
              ref={horizontalScrollRef}
              horizontal
              contentContainerStyle={{ minWidth: canvasWidth }}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              bounces
              keyboardShouldPersistTaps="handled"
            >
              {/* Pinch zoom + double-tap reset */}
              <GestureDetector gesture={composed}>
                <Reanimated.View
                  style={[
                    {
                      width: canvasWidth,
                      height: canvasHeight,
                      backgroundColor: "#FAF8F5",
                    },
                    canvasAnimStyle,
                  ]}
                >
                  {/* Read-only content surface — centered within the canvas */}
                  <View
                    style={{
                      position: "absolute",
                      left: CANVAS_EXTRA / 2,
                      top: CANVAS_EXTRA / 2,
                      width: Math.max(contentWidth, SCREEN_WIDTH),
                      height: Math.max(contentHeight, 300),
                    }}
                    pointerEvents="none"
                  >
                    {sortedBlocks.length === 0 && (
                      <Text style={styles.emptyText}>
                        No content in this entry.
                      </Text>
                    )}

                    {sortedBlocks.map((block) => {
                      const adjX = block.x - minX;
                      const adjY = block.y - minY;

                      if (block.type === "text") {
                        const tb = block as TextBlockType;
                        const textStyle: TextStyle = {
                          fontSize: tb.fontSize,
                          lineHeight: tb.lineHeight,
                          letterSpacing: tb.letterSpacing,
                          fontWeight: tb.isBold ? "bold" : "normal",
                          fontStyle: tb.isItalic ? "italic" : "normal",
                          textDecorationLine: tb.isUnderline
                            ? "underline"
                            : "none",
                          color: tb.textColor,
                          textAlign: tb.textAlign,
                        };
                        return (
                          <View
                            key={block.id}
                            style={[
                              styles.blockBase,
                              {
                                left: adjX,
                                top: adjY,
                                width: block.width,
                                height: block.height,
                                zIndex: block.zIndex,
                                transform: [{ rotate: `${block.rotation}deg` }],
                              },
                            ]}
                          >
                            <Text style={textStyle}>{tb.text}</Text>
                          </View>
                        );
                      }

                      if (block.type === "image") {
                        const ib = block as ImageBlockType;
                        return (
                          <View
                            key={block.id}
                            style={[
                              styles.imageBlockBase,
                              {
                                left: adjX,
                                top: adjY,
                                width: block.width,
                                height: block.height,
                                zIndex: block.zIndex,
                                transform: [{ rotate: `${block.rotation}deg` }],
                              },
                            ]}
                          >
                            <Image
                              source={{ uri: ib.imageUri }}
                              style={styles.blockImage}
                              resizeMode="cover"
                            />
                          </View>
                        );
                      }

                      return null;
                    })}
                  </View>
                </Reanimated.View>
              </GestureDetector>
            </ScrollView>
          </ScrollView>
        </View>
      </Animated.View>
    </Modal>
  );
}

// ---- styles ----------------------------------------------------------------

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.88,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 20,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1CBC3",
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EDE8",
  },
  titleText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#2E2A26",
    marginRight: 12,
  },
  hint: {
    textAlign: "center",
    fontSize: 11,
    color: "#B5A993",
    paddingVertical: 6,
  },
  viewport: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#FAF8F5",
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "center",
    marginTop: 40,
  },
  blockBase: {
    position: "absolute",
    padding: 12,
    backgroundColor: "transparent",
    borderRadius: 8,
  },
  imageBlockBase: {
    position: "absolute",
    overflow: "hidden",
    borderRadius: 8,
  },
  blockImage: {
    width: "100%",
    height: "100%",
  },
});
