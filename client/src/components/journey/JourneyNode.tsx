import React, { useEffect, useRef } from "react";
import { StyleSheet, Pressable, View, Text, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type JourneyNodeProps = {
  stage: number;
  status: "locked" | "current" | "completed";
  position: { x: number; y: number };
  theme: "mountain" | "gears" | "star" | "book" | "compass";
  title?: string;
  date?: string;
  onPress?: () => void;
};

// Accent color per theme
const THEME_ACCENTS: Record<string, { bg: string; border: string; icon: string; glow: string }> = {
  mountain: { bg: '#FFF7ED', border: '#F59E0B', icon: 'partly-sunny-outline', glow: '#F59E0B' },
  gears:    { bg: '#F0FDF4', border: '#22C55E', icon: 'construct-outline',     glow: '#22C55E' },
  star:     { bg: '#FFFBEB', border: '#EAB308', icon: 'star-outline',          glow: '#EAB308' },
  book:     { bg: '#FAF5FF', border: '#8B5CF6', icon: 'book-outline',          glow: '#8B5CF6' },
  compass:  { bg: '#EFF6FF', border: '#3B82F6', icon: 'compass-outline',       glow: '#3B82F6' },
};

const NODE_W = 82;
const NODE_H = 72;

function formatNodeDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

export const JourneyNode: React.FC<JourneyNodeProps> = ({
  status,
  position,
  theme,
  title,
  date,
  onPress,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const accent = THEME_ACCENTS[theme] ?? THEME_ACCENTS.star;

  // Pulsing animation for current node
  useEffect(() => {
    if (status === 'current') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.06, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1,    duration: 900, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [status, pulseAnim]);

  const isCurrent = status === 'current';
  const isLocked  = status === 'locked';

  return (
    <Pressable
      onPress={!isLocked ? onPress : undefined}
      disabled={isLocked}
      style={[
        styles.nodeContainer,
        { top: position.y, left: position.x },
        isLocked && { opacity: 0.38 },
      ]}
    >
      <Animated.View
        style={[
          styles.card,
          { backgroundColor: accent.bg, borderColor: isCurrent ? accent.border : '#E5E7EB' },
          isCurrent && styles.cardCurrent,
          isCurrent && { transform: [{ scale: pulseAnim }] },
        ]}
      >
        {/* Top row: icon + date */}
        <View style={styles.topRow}>
          <View style={[styles.iconBadge, { backgroundColor: accent.border + '22' }]}>
            <Ionicons
              name={accent.icon as any}
              size={14}
              color={accent.border}
            />
          </View>
          {date ? (
            <Text style={styles.dateLabel}>{formatNodeDate(date)}</Text>
          ) : null}
          {isCurrent && (
            <View style={[styles.liveDot, { backgroundColor: accent.border }]} />
          )}
        </View>

        {/* Title */}
        <Text
          style={[styles.titleText, isLocked && styles.titleLocked]}
          numberOfLines={2}
        >
          {isLocked ? '🔒 Locked' : (title?.trim() || 'Untitled')}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  nodeContainer: {
    position: 'absolute',
    transform: [{ translateX: -NODE_W / 2 }, { translateY: -NODE_H / 2 }],
    zIndex: 10,
  },
  card: {
    width: NODE_W,
    height: NODE_H,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    backgroundColor: '#FFFFFF',
  },
  cardCurrent: {
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: '600',
    letterSpacing: 0.3,
    flex: 1,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginLeft: 2,
  },
  titleText: {
    fontSize: 13,
    fontFamily: 'DancingScript_700Bold',
    color: '#1F2937',
    lineHeight: 17,
    letterSpacing: 0.2,
  },
  titleLocked: {
    color: '#9CA3AF',
    fontWeight: '500',
  },
});