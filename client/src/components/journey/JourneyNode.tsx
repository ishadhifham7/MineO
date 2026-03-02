import React, { useEffect, useRef } from "react";
import { StyleSheet, Pressable, View, Animated } from "react-native";

type JourneyNodeProps = {
  stage: number;
  status: "locked" | "current" | "completed";
  position: { x: number; y: number };
  theme: "mountain" | "gears" | "star" | "book" | "compass";
  onPress?: () => void;
};

// Simple color themes (no images/emojis)
const THEME_COLORS: Record<string, string> = {
  mountain: '#8B7355',
  gears: '#6B7280',
  star: '#FCD34D',
  book: '#8B5CF6',
  compass: '#3B82F6',
};

export const JourneyNode: React.FC<JourneyNodeProps> = ({
  status,
  position,
  theme,
  onPress,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  // Remove theme colors - use neutral white for all nodes
  const themeColor = '#FFFFFF';

  // Pulsing animation for current node
  useEffect(() => {
    if (status === 'current') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [status, pulseAnim]);

  return (
    <Pressable
      onPress={status !== 'locked' ? onPress : undefined}
      disabled={status === 'locked'}
      style={[
        styles.nodeContainer,
        {
          top: position.y,
          left: position.x,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.nodeFrame,
          status === 'current' && {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        {/* Border glow for current node */}
        {status === 'current' && (
          <View style={styles.glowBorder} />
        )}

        {/* Simple colored circle node */}
        <View style={[
          styles.nodeContent,
          { backgroundColor: themeColor },
          status === 'locked' && styles.lockedNode,
        ]} />
      </Animated.View>
    </Pressable>
  );
};

const NODE_SIZE = 60;

const styles = StyleSheet.create({
  nodeContainer: {
    position: "absolute",
    transform: [{ translateX: -NODE_SIZE / 2 }, { translateY: -NODE_SIZE / 2 }],
    zIndex: 10,
  },
  nodeFrame: {
    width: NODE_SIZE,
    height: NODE_SIZE,
  },
  glowBorder: {
    position: 'absolute',
    width: NODE_SIZE + 12,
    height: NODE_SIZE + 12,
    left: -6,
    top: -6,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#3B82F6',
    opacity: 0.6,
  },
  nodeContent: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  lockedNode: {
    opacity: 0.4,
  },
});