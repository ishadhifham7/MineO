// src/features/calendar/MomentPreviewSheet.tsx
import React, { useMemo, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import type { JournalEntry } from "./types";
import { colors } from "../../constants/colors";

/**
 * Props for MomentPreviewSheet component
 */
export interface MomentPreviewSheetProps {
  visible: boolean;
  journal: JournalEntry | null;
  onClose: () => void;
  onViewFull: (journalId: string) => void;
}

/**
 * MomentPreviewSheet - Pure UI component for displaying journal preview
 * in a bottom sheet modal
 *
 * Responsibilities:
 * - Display journal preview information
 * - Provide "View Full Moment" action
 * - Handle close interaction
 *
 * Does NOT:
 * - Fetch data
 * - Handle navigation
 * - Contain business logic
 */
export const MomentPreviewSheet: React.FC<MomentPreviewSheetProps> = ({
  visible,
  journal,
  onClose,
  onViewFull,
}) => {
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  // Define snap points for the bottom sheet
  const snapPoints = useMemo(() => ["35%", "50%"], []);

  // Handle sheet changes
  React.useEffect(() => {
    if (visible && journal) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible, journal]);

  // Render backdrop with dismiss on press
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  // Format date to readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  // Handle view full button press
  const handleViewFull = () => {
    if (journal) {
      onViewFull(journal.id);
    }
  };

  // Generate preview text
  const getPreviewText = (): string => {
    if (!journal) return "";

    // If summary exists, use it
    if (journal.summary) {
      return journal.summary;
    }

    // Otherwise, show placeholder
    return "Tap to view your moment...";
  };

  if (!journal) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <View style={styles.contentContainer}>
        {/* Date Header */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateIcon}>📅</Text>
          <Text style={styles.dateText}>{formatDate(journal.date)}</Text>
        </View>

        {/* Title */}
        {journal.title && (
          <View style={styles.titleContainer}>
            <Text style={styles.titleIcon}>📝</Text>
            <Text style={styles.titleText} numberOfLines={2}>
              {journal.title}
            </Text>
          </View>
        )}

        {/* Preview Text */}
        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>Preview:</Text>
          <Text style={styles.previewText} numberOfLines={3}>
            {getPreviewText()}
          </Text>
        </View>

        {/* View Full Button */}
        <TouchableOpacity
          style={styles.viewFullButton}
          onPress={handleViewFull}
          activeOpacity={0.7}
        >
          <Text style={styles.viewFullText}>View Full Moment →</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: colors.textMuted,
    width: 40,
    height: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dateIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textDark,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  titleIcon: {
    fontSize: 18,
    marginRight: 8,
    marginTop: 2,
  },
  titleText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: colors.textDark,
    lineHeight: 24,
  },
  previewContainer: {
    marginBottom: 24,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textMuted,
    marginBottom: 8,
  },
  previewText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textDark,
  },
  viewFullButton: {
    backgroundColor: colors.average,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  viewFullText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
