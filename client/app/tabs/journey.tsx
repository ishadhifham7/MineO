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
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { JourneyCanvas } from "../../src/components/journey/JourneyCanvas";
import { JourneyNode } from "../../src/components/journey/JourneyNode";
import { TimelinePath } from "../../src/components/journey/TimelinePath";
import { JournalModal } from "../../src/components/journey/JournalModal";
import { useAuth } from "../../src/providers/AuthProvider";
import { useJourney } from "../../src/providers/JourneyProvider";
import { JournalApi } from "../../src/services/journal.service";
import type { JournalEntryWithBlocks } from "../../src/features/journal/journal.types";

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
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { journals, isLoading, error, refreshJourneys } = useJourney();
  const [selectedJournal, setSelectedJournal] =
    useState<JournalEntryWithBlocks | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingJournal, setLoadingJournal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshJourneys();
      console.log("Journey refreshed successfully");
    } catch (err) {
      console.error("Error refreshing journey:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleNodePress = async (journalId: string) => {
    try {
      setLoadingJournal(true);
      setModalVisible(true);
      console.log("Fetching journal:", journalId);

      const response = await JournalApi.getById(journalId);
      console.log("Journal fetched:", response.data);
      setSelectedJournal(response.data);
    } catch (error: any) {
      console.error("Failed to fetch journal:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

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
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Ionicons
              name="map"
              size={28}
              color="#B5A993"
              style={styles.headerIcon}
            />
            <Text style={styles.headerTitle}>Journey Map</Text>
          </View>
          <Text style={styles.headerSubtitle}>Every step tells a story</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#B5A993" />
          <Text style={styles.loadingText}>Loading your journey map...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Ionicons
              name="map"
              size={28}
              color="#B5A993"
              style={styles.headerIcon}
            />
            <Text style={styles.headerTitle}>Journey Map</Text>
          </View>
          <Text style={styles.headerSubtitle}>Every step tells a story</Text>
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>LOCK</Text>
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
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Ionicons
              name="map"
              size={28}
              color="#B5A993"
              style={styles.headerIcon}
            />
            <Text style={styles.headerTitle}>Journey Map</Text>
          </View>
          <Text style={styles.headerSubtitle}>Every step tells a story</Text>
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>!</Text>
          </View>
          <Text style={styles.emptyTitle}>Error Loading Journey</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
          <Pressable style={styles.loginButton} onPress={refreshJourneys}>
            <Text style={styles.loginButtonText}>Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (journals.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Ionicons
              name="map"
              size={28}
              color="#B5A993"
              style={styles.headerIcon}
            />
            <Text style={styles.headerTitle}>Journey Map</Text>
          </View>
          <Text style={styles.headerSubtitle}>Every step tells a story</Text>
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>J</Text>
          </View>
          <Text style={styles.emptyTitle}>No journals yet</Text>
          <Text style={styles.emptySubtitle}>
            Start writing to see your journey map unfold
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Ionicons
            name="map"
            size={28}
            color="#B5A993"
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Journey Map</Text>
        </View>
        <Text style={styles.headerSubtitle}>Every step tells a story</Text>
      </View>

      <View style={styles.canvasWrapper}>
        <JourneyCanvas
          contentHeight={contentHeight}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#B5A993"
              colors={["#B5A993"]}
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
      </View>

      {/* Journal Modal */}
      <JournalModal
        isVisible={modalVisible}
        journal={selectedJournal}
        loading={loadingJournal}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F1E7", // Match goal tracker background
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 2,
    borderBottomColor: "#B5A993",
    shadowColor: "#B5A993",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIcon: {
    opacity: 0.9,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#2E2A26",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#B5A993",
    marginTop: 6,
    fontStyle: "italic",
  },
  canvasWrapper: {
    flex: 1,
    backgroundColor: "#F6F1E7",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#B5A993",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E2A26",
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#6B645C",
    textAlign: "center",
    lineHeight: 22,
  },
  loginButton: {
    marginTop: 28,
    paddingHorizontal: 36,
    paddingVertical: 16,
    backgroundColor: "#B5A993",
    borderRadius: 14,
    shadowColor: "#B5A993",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#3F5D8A",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

