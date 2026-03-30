import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { JourneyCanvas } from "../../src/components/journey/JourneyCanvas";
import { JourneyNode } from "../../src/components/journey/JourneyNode";
import { TimelinePath } from "../../src/components/journey/TimelinePath";
import { JournalModal } from "../../src/components/journey/JournalModal";
import { useAuth } from "../../src/providers/AuthProvider";
import { useJourney } from "../../src/providers/JourneyProvider";
import { JournalApi } from "../../src/services/journal.service";
import type { JournalEntryWithBlocks } from "../../src/features/journal/journal.types";
import {
  HomeStyleScreen,
  SectionCard,
} from "../../src/components/ui/HomeStyleScreen";

const SCREEN_WIDTH = Dimensions.get("window").width;

// Theme rotation for visual variety
const THEME_ROTATION = [
  "mountain",
  "gears",
  "star",
  "book",
  "compass",
] as const;

// Determine node status based on position
const getNodeStatus = (
  index: number,
  totalCount: number,
): "completed" | "current" | "locked" => {
  // For real journals loaded from backend, all existing ones are "completed"
  // The most recent one is "current" (now at the TOP since we start from bottom)
  if (index === totalCount - 1) return "current"; // Newest (at top)
  return "completed"; // All older journals below
};

// Generate winding path positions - starts at BOTTOM and climbs UP
const generatePositions = (count: number) => {
  const positions = [];
  const verticalSpacing = 150; // Space between each node

  // Wide X positions for dramatic winding - the path swings from edge to edge
  const leftX = SCREEN_WIDTH * 0.14;
  const midLeftX = SCREEN_WIDTH * 0.36;
  const midRightX = SCREEN_WIDTH * 0.64;
  const rightX = SCREEN_WIDTH * 0.86;

  // 6-point alternating pattern creates a continuous sine-like wave
  const pattern = [leftX, midLeftX, midRightX, rightX, midRightX, midLeftX];

  // Oldest journal sits at the bottom; each newer one climbs upward
  const startY = 160 + (count - 1) * verticalSpacing;

  for (let i = 0; i < count; i++) {
    positions.push({
      centerX: pattern[i % pattern.length],
      centerY: startY - i * verticalSpacing,
    });
  }

  return positions;
};

export default function JourneyScreen() {
  const journeyScrollRef = React.useRef<
    import("react-native").ScrollView | null
  >(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { journals, isLoading, error, refreshJourneys } = useJourney();
  const [selectedJournal, setSelectedJournal] =
    useState<JournalEntryWithBlocks | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingJournal, setLoadingJournal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      requestAnimationFrame(() => {
        journeyScrollRef.current?.scrollTo({ y: 0, animated: false });
      });
    }, []),
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshJourneys();
    } catch (err) {
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleNodePress = async (journalId: string) => {
    try {
      setLoadingJournal(true);
      setModalVisible(true);

      const response = await JournalApi.getById(journalId);
      setSelectedJournal(response.data);
    } catch (error: any) {
      // Show error alert to user
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to load journal content";
      alert(`Error: ${errorMsg}`);

      setModalVisible(false);
      setSelectedJournal(null);
    } finally {
      setLoadingJournal(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedJournal(null);
  };

  // Sort journals by date (oldest first) so path starts at bottom and climbs up
  const sortedJournals = [...journals].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB; // Ascending: oldest date first (bottom), newest last (top)
  });

  const positions = generatePositions(sortedJournals.length);
  const stages = sortedJournals.map((journal, index) => ({
    id: journal.id,
    title: journal.title,
    date: journal.date,
    centerX: positions[index].centerX,
    centerY: positions[index].centerY,
    status: getNodeStatus(index, sortedJournals.length),
    theme: THEME_ROTATION[index % THEME_ROTATION.length],
  }));

  // Calculate content height based on the FIRST stage (bottom node) + padding
  // Oldest journal is at the BOTTOM (highest Y value), not the last in the array
  const maxY =
    stages.length > 0 ? Math.max(...stages.map((s) => s.centerY)) : 900;
  const contentHeight = maxY + 200;

  // Show loading while checking auth or loading journals
  if (authLoading || isLoading) {
    return (
      <HomeStyleScreen
        kicker="Progress Path"
        title="Journey Map"
        subtitle="Every step tells a story"
        hideHero
        scrollable={false}
      >
        <SectionCard style={styles.centerCard}>
          <ActivityIndicator size="large" color="#6B645C" />
          <Text style={styles.loadingText}>Loading your journey map...</Text>
        </SectionCard>
      </HomeStyleScreen>
    );
  }

  // Not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <HomeStyleScreen
        kicker="Progress Path"
        title="Journey Map"
        subtitle="Every step tells a story"
        hideHero
        scrollable={false}
      >
        <SectionCard style={styles.centerCard}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="lock-closed-outline" size={34} color="#8C7F6A" />
          </View>
          <Text style={styles.emptyTitle}>Please Login</Text>
          <Text style={styles.emptySubtitle}>
            You need to be logged in to view your journey map
          </Text>
          <Pressable
            style={styles.loginButton}
            onPress={() => router.push("/auth/login")}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </Pressable>
        </SectionCard>
      </HomeStyleScreen>
    );
  }

  // Show error state
  if (error) {
    return (
      <HomeStyleScreen
        kicker="Progress Path"
        title="Journey Map"
        subtitle="Every step tells a story"
        hideHero
        scrollable={false}
      >
        <SectionCard style={styles.centerCard}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="alert-circle-outline" size={34} color="#8C7F6A" />
          </View>
          <Text style={styles.emptyTitle}>Error Loading Journey</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
          <Pressable style={styles.loginButton} onPress={refreshJourneys}>
            <Text style={styles.loginButtonText}>Try Again</Text>
          </Pressable>
        </SectionCard>
      </HomeStyleScreen>
    );
  }

  if (journals.length === 0) {
    return (
      <HomeStyleScreen
        kicker="Progress Path"
        title="Journey Map"
        subtitle="Every step tells a story"
        hideHero
        scrollable={false}
      >
        <SectionCard style={styles.centerCard}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="book-outline" size={34} color="#8C7F6A" />
          </View>
          <Text style={styles.emptyTitle}>No journals yet</Text>
          <Text style={styles.emptySubtitle}>
            Start writing to see your journey map unfold
          </Text>
        </SectionCard>
      </HomeStyleScreen>
    );
  }

  return (
    <HomeStyleScreen
      kicker="Progress Path"
      title="Journey Map"
      subtitle="Every step tells a story"
      hideHero
      stats={[{ value: journals.length, label: "Entries" }]}
      scrollable={false}
      contentContainerStyle={styles.screenContent}
    >
      <View style={styles.mapIntroContainer}>
        <Text style={styles.mapIntroLineOne}>
          Tap into moments. Explore your growth.
        </Text>
        <Text style={styles.mapIntroLineTwo}>Keep moving forward.</Text>
      </View>

      <SectionCard style={styles.canvasCard}>
        <JourneyCanvas
          scrollRef={journeyScrollRef}
          contentHeight={contentHeight}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#4E6FA3"
              colors={["#4E6FA3"]}
            />
          }
        >
          {/* Render the enhanced serpentine timeline path */}
          <TimelinePath nodes={stages} height={contentHeight} />

          {/* Render journey nodes with themes and states */}
          {stages.map((stage, index) => (
            <JourneyNode
              key={stage.id}
              stage={index + 1}
              status={stage.status}
              theme={stage.theme}
              title={stage.title}
              date={stage.date}
              position={{ x: stage.centerX, y: stage.centerY }}
              onPress={() => handleNodePress(stage.id)}
            />
          ))}
        </JourneyCanvas>
      </SectionCard>

      {/* Journal Modal */}
      <JournalModal
        isVisible={modalVisible}
        journal={selectedJournal}
        loading={loadingJournal}
        onClose={handleCloseModal}
      />
    </HomeStyleScreen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingBottom: 8,
  },
  mapIntroContainer: {
    paddingHorizontal: 4,
    marginBottom: 10,
    marginTop: 10,
  },
  mapIntroLineOne: {
    fontSize: 18,
    lineHeight: 24,
    color: "#2E2A26",
    fontWeight: "700",
  },
  mapIntroLineTwo: {
    marginTop: 4,
    marginBottom: 10,
    fontSize: 14,
    lineHeight: 20,
    color: "#6B645C",
    fontWeight: "500",
  },
  canvasCard: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
    overflow: "hidden",
  },
  centerCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B645C",
    fontWeight: "500",
  },
  emptyIconContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#E8E4DD",
    shadowColor: "#8C7F6A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E2A26",
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#6B645C",
    textAlign: "center",
    lineHeight: 22,
  },
  loginButton: {
    marginTop: 18,
    paddingHorizontal: 36,
    paddingVertical: 12,
    backgroundColor: "#2E2A26",
    borderRadius: 14,
    shadowColor: "#2E2A26",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
