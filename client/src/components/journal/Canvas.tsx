import React, { ReactNode, useEffect, useRef } from "react";
import { ScrollView, View, Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");
const CANVAS_SIZE = 4000;

type CanvasProps = {
  children?: ReactNode;
};

export function Canvas({ children }: CanvasProps) {
  const horizontalScrollRef = useRef<ScrollView>(null);
  const verticalScrollRef = useRef<ScrollView>(null);

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
  return (
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
          <View style={styles.canvas}>
            {/* Grid (visual reference only) */}
            {Array.from({ length: 20 }).map((_, i) => (
              <View
                key={`h-${i}`}
                style={[
                  styles.gridLine,
                  { top: i * 200, left: 0, width: CANVAS_SIZE, height: 1 },
                ]}
              />
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
              <View
                key={`v-${i}`}
                style={[
                  styles.gridLine,
                  { left: i * 200, top: 0, width: 1, height: CANVAS_SIZE },
                ]}
              />
            ))}
            {/* Blocks live here */}
            {children}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
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
