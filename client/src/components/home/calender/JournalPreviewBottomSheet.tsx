import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getJournalsByDate } from "../../../features/journal/journal.api";
import type { JournalEntryWithBlocks } from "../../../features/journal/journal.types";
import type { TextBlock } from "../../../../types/journal";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SHEET_HEIGHT = Math.round(SCREEN_HEIGHT * 0.52);

// ---- helpers ---------------------------------------------------------------

function extractPreview(blocks: JournalEntryWithBlocks["blocks"]): string {
  const textBlock = blocks.find((b): b is TextBlock => b.type === "text");
  if (!textBlock || !textBlock.text?.trim())
    return "No text preview available.";
  const text = textBlock.text.trim();
  return text.length > 50 ? `${text.slice(0, 50)}...` : text;
}

// ---- types -----------------------------------------------------------------

interface Props {
  visible: boolean;
  date: string;
  onClose: () => void;
  onSelectEntry: (entry: JournalEntryWithBlocks) => void;
}

// ---- component -------------------------------------------------------------

export default function JournalPreviewBottomSheet({
  visible,
  date,
  onClose,
  onSelectEntry,
}: Props) {
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const [entries, setEntries] = useState<JournalEntryWithBlocks[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch entries every time the sheet opens for a new date
  const fetchEntries = useCallback(async () => {
    if (!date) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getJournalsByDate(date);
      setEntries(data);
    } catch {
      setError("Could not load journals for this date.");
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  // Animate in when visible; reset entries on each open
  useEffect(() => {
    if (visible) {
      setEntries([]);
      slideAnim.setValue(SHEET_HEIGHT);
      fetchEntries();
      Animated.spring(slideAnim, {
        toValue: 0,
        bounciness: 3,
        speed: 14,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fetchEntries]);

  // Animate out, then notify parent
  const handleClose = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: SHEET_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(() => onClose());
  }, [slideAnim, onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      {/* Semi-transparent backdrop */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Sliding sheet */}
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
      >
        {/* Drag handle */}
        <View style={styles.handle} />

        {/* Header row */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>
            Journals · <Text style={styles.dateText}>{date}</Text>
          </Text>
          <TouchableOpacity
            onPress={handleClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={24} color="#B5A993" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="small" color="#7C6F5B" />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Ionicons name="alert-circle-outline" size={28} color="#E53935" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : entries.length === 0 ? (
          <View style={styles.centered}>
            <Ionicons name="document-outline" size={32} color="#B5A993" />
            <Text style={styles.emptyText}>No journals on this date.</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {entries.map((entry) => (
              <TouchableOpacity
                key={entry.id}
                style={styles.card}
                activeOpacity={0.75}
                onPress={() => {
                  handleClose();
                  onSelectEntry(entry);
                }}
              >
                <View style={styles.cardIconWrap}>
                  <Ionicons name="book-outline" size={20} color="#7C6F5B" />
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {entry.title?.trim() || "Untitled"}
                  </Text>
                  <Text style={styles.cardPreview} numberOfLines={2}>
                    "{extractPreview(entry.blocks)}"
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#B5A993" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </Animated.View>
    </Modal>
  );
}

// ---- styles ----------------------------------------------------------------

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 16,
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EDE8",
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2E2A26",
  },
  dateText: {
    color: "#7C6F5B",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingBottom: 20,
  },
  errorText: {
    color: "#E53935",
    fontSize: 13,
    textAlign: "center",
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "center",
  },
  list: {
    padding: 16,
    gap: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAF8F5",
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "#EDE9E4",
  },
  cardIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F0EBE3",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E2A26",
    marginBottom: 3,
  },
  cardPreview: {
    fontSize: 12,
    color: "#6B645C",
    lineHeight: 17,
    fontStyle: "italic",
  },
});
