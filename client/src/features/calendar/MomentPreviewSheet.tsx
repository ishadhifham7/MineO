// src/features/calendar/MomentPreviewSheet.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";
import type { JournalEntry } from "./types";
import { colors } from "../../constants/colors";

const SHEET_HEIGHT = 360;

export interface MomentPreviewSheetProps {
  visible: boolean;
  journals: JournalEntry[];
  onClose: () => void;
  onViewFull: (journalId: string) => void;
}

export const MomentPreviewSheet: React.FC<MomentPreviewSheetProps> = ({
  visible,
  journals,
  onClose,
  onViewFull,
}) => {
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SHEET_HEIGHT,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, backdropOpacity]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Journals are already sorted newest-first from useCalendarData
  const latest = journals[0] ?? null;
  const count = journals.length;

  if (!latest) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Animated blur backdrop */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: backdropOpacity }]}
        pointerEvents={visible ? "auto" : "none"}
      >
        <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </BlurView>
      </Animated.View>

      {/* Spacer to push sheet to bottom */}
      <View style={styles.spacer} pointerEvents="none" />

      {/* Animated slide-up sheet */}
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Handle bar */}
        <View style={styles.handle} />

        {/* Date + entry count badge */}
        <View style={styles.row}>
          <Text style={styles.icon}>📅</Text>
          <Text style={styles.dateText}>{formatDate(latest.date)}</Text>
          {count > 1 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{count} entries</Text>
            </View>
          )}
        </View>

        {/* List all entries */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.entriesList}
        >
          {journals.map((journal, index) => (
            <TouchableOpacity
              key={journal.id}
              style={[styles.entryCard, index === 0 && styles.entryCardFirst]}
              onPress={() => onViewFull(journal.id)}
              activeOpacity={0.75}
            >
              {/* Entry number dot */}
              <View style={styles.entryDot}>
                <Text style={styles.entryDotText}>{index + 1}</Text>
              </View>
              <View style={styles.entryContent}>
                {journal.title ? (
                  <Text style={styles.entryTitle} numberOfLines={1}>
                    {journal.title}
                  </Text>
                ) : null}
                <Text style={styles.entryPreview} numberOfLines={2}>
                  {journal.summary ?? "Tap to view this moment..."}
                </Text>
              </View>
              <Text style={styles.entryArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  spacer: {
    flex: 1,
  },
  sheet: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 16,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    alignSelf: "center",
    marginBottom: 20,
    opacity: 0.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textDark,
    flex: 1,
  },
  badge: {
    backgroundColor: "#6366F1",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  entryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.04)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  entryCardFirst: {
    backgroundColor: "rgba(99,102,241,0.08)",
    borderWidth: 1,
    borderColor: "rgba(99,102,241,0.18)",
  },
  entryDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  entryDotText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  entryContent: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textDark,
    marginBottom: 2,
  },
  entryPreview: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  entryArrow: {
    fontSize: 22,
    color: colors.textMuted,
    marginLeft: 8,
  },
  entriesList: {
    maxHeight: 280,
  },
});
