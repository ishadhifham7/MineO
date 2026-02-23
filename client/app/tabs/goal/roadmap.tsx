import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useGoal } from "../../../src/features/goal/goal.context";
import Checkbox from "expo-checkbox";
import { BlurView } from "expo-blur";
import { toggleStageCompletionApi } from "../../../src/features/goal/goal.api";

const GoalRoadmapScreen: React.FC = () => {
  const { currentGoal, goals } = useGoal();
  const params = useLocalSearchParams();

  // Get the goal by ID from URL params, fallback to currentGoal or most recent
  const goalId = params.id as string | undefined;
  const displayGoal = goalId
    ? goals.find((g) => g.id === goalId)
    : currentGoal || goals[0];

  // Local state for optimistic UI (optional, fallback to context if needed)
  const [localStages, setLocalStages] = useState(
    displayGoal ? displayGoal.stages.map((s) => ({ ...s })) : [],
  );

  // Sync local stages if goal changes - MUST be before early return
  React.useEffect(() => {
    if (displayGoal) {
      setLocalStages(displayGoal.stages.map((s) => ({ ...s })));
    }
  }, [displayGoal]);

  if (!displayGoal) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.push("/tabs/goal/")}>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Goal Roadmap</Text>
          <View style={{ width: 40 }} />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text style={styles.noDraftText}>
            {goalId ? "Goal not found." : "No goal available."}
          </Text>
          <Pressable
            style={styles.generateButton}
            onPress={() => router.push("/tabs/goal/chat")}
          >
            <Text style={styles.generateText}>Create New Goal</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const handleBackToGoals = () => {
    // Navigate back to the goals list in the goal tab
    router.push("/tabs/goal/");
  };

  const handleToggleStage = async (stageId: string) => {
    if (!displayGoal) return;

    // Find the current stage to get its current completion status
    const stage = localStages.find((s) => s.id === stageId);
    if (!stage) return;

    const newCompletedStatus = !stage.completed;

    // Optimistic update - update UI immediately
    setLocalStages((prev) =>
      prev.map((s) =>
        s.id === stageId ? { ...s, completed: newCompletedStatus } : s,
      ),
    );

    try {
      // Call backend API to persist the change
      await toggleStageCompletionApi(
        displayGoal.id,
        stageId,
        newCompletedStatus,
      );

      // Optionally refresh goals from context to ensure sync
      // fetchGoals(); // Uncomment if you want to refresh all goals
    } catch (error) {
      console.error("Failed to toggle stage completion:", error);

      // Revert optimistic update on error
      setLocalStages((prev) =>
        prev.map((s) =>
          s.id === stageId ? { ...s, completed: stage.completed } : s,
        ),
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Goal Roadmap</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{displayGoal.title}</Text>
        <Text style={styles.description}>{displayGoal.description}</Text>

        <Text style={styles.stagesHeader}>Your Journey:</Text>

        <View style={{ gap: 12 }}>
          {localStages.map((item) => (
            <View key={item.id} style={styles.stageCard}>
              {/* Blur overlay if completed */}
              {item.completed && (
                <BlurView
                  intensity={30}
                  tint="light"
                  style={StyleSheet.absoluteFill}
                />
              )}
              <View style={styles.stageRow}>
                <Checkbox
                  value={item.completed}
                  onValueChange={() => handleToggleStage(item.id)}
                  color={item.completed ? "#44BBD4" : undefined}
                  style={styles.stageCheckbox}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.stageTitle}>{item.title}</Text>
                  <Text style={styles.stageDescription}>
                    {item.description}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <Pressable style={styles.doneButton} onPress={handleBackToGoals}>
          <Text style={styles.doneText}>Save and View All Goals</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default GoalRoadmapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  header: {
    paddingTop: 60,
    paddingBottom: 18,
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backText: {
    color: "#44BBD4",
    fontSize: 16,
    fontWeight: "600",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: 0.3,
  },

  noDraftText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 100,
    marginBottom: 20,
    color: "#64748B",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 10,
    color: "#0F172A",
  },

  description: {
    fontSize: 15,
    marginBottom: 32,
    color: "#475569",
    lineHeight: 24,
  },

  stagesHeader: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    color: "#0F172A",
  },

  /* ===================== */
  /* Stage Card Redesign   */
  /* ===================== */

  stageCard: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 18,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },

  stageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  stageCheckbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#44BBD4",
    marginRight: 16,
    marginTop: 4,
    backgroundColor: "#ECFEFF",
  },

  stageTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
    color: "#0F172A",
    lineHeight: 22,
  },

  stageDescription: {
    fontSize: 14.5,
    color: "#64748B",
    lineHeight: 22, // ← better line spacing
    paddingRight: 4,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 50,
  },

  generateButton: {
    backgroundColor: "#44BBD4",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 12,
  },

  generateText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  continueButton: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  continueText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },

  doneButton: {
    backgroundColor: "#44BBD4",
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 28,
  },

  doneText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
