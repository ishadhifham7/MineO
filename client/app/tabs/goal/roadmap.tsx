import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { useGoal } from "../../../src/features/goal/goal.context";
import Checkbox from "expo-checkbox";
import { BlurView } from "expo-blur";

const GoalRoadmapScreen: React.FC = () => {
  const { currentGoal, goals } = useGoal();
  // If no current goal, try to get the most recent one
  const displayGoal = currentGoal || goals[0];

  // Local state for optimistic UI (optional, fallback to context if needed)
  const [localStages, setLocalStages] = useState(
    displayGoal ? displayGoal.stages.map((s) => ({ ...s })) : [],
  );

  if (!displayGoal) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDraftText}>No goal available.</Text>
        <Pressable
          style={styles.generateButton}
          onPress={() => router.push("/tabs/goal/chat")}
        >
          <Text style={styles.generateText}>Create New Goal</Text>
        </Pressable>
      </View>
    );
  }

  // Sync local stages if goal changes
  React.useEffect(() => {
    setLocalStages(displayGoal.stages.map((s) => ({ ...s })));
  }, [displayGoal]);

  const handleBackToGoals = () => {
    router.push("/tabs/goals");
  };

  const handleToggleStage = (stageId: string) => {
    setLocalStages((prev) =>
      prev.map((s) =>
        s.id === stageId ? { ...s, completed: !s.completed } : s,
      ),
    );
    // Optionally update in context/backend
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
          <Text style={styles.doneText}>View All Goals</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default GoalRoadmapScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backText: { color: "#63D1E6", fontSize: 16, fontWeight: "500" },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
  content: { flex: 1, padding: 20 },
  noDraftText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 100,
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8, color: "#111827" },
  description: {
    fontSize: 16,
    marginBottom: 24,
    color: "#4B5563",
    lineHeight: 22,
  },
  stagesHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#111827",
  },
  stageCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  stageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  stageCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#44BBD4",
    marginRight: 10,
    backgroundColor: "#F0F9FA",
  },
  stageTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
    color: "#111",
  },
  stageDescription: { fontSize: 14, color: "#4B5563" },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  generateButton: {
    backgroundColor: "#44BBD4",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  generateText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  continueButton: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  continueText: { color: "#111827", fontSize: 16, fontWeight: "600" },
  doneButton: {
    backgroundColor: "#44BBD4",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
  },
  doneText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
