import React from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useGoal, Goal } from "../../../src/features/goal/goal.context";

const GoalRoadmapScreen: React.FC = () => {
  const { currentGoal, goals, fetchGoals } = useGoal();

  // If no current goal, try to get the most recent one
  const displayGoal = currentGoal || goals[0];

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

  const handleBackToGoals = () => {
    router.push("/tabs/goals");
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

      <View style={styles.content}>
        <Text style={styles.title}>{displayGoal.title}</Text>
        <Text style={styles.description}>{displayGoal.description}</Text>

        <Text style={styles.stagesHeader}>Your Journey:</Text>

        <FlatList
          data={displayGoal.stages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.stageCard}>
              <View style={styles.stagesHeader}>
                <Text style={styles.stageNumber}>Stage {item.order}</Text>
                {item.completed && (
                  <Text style={styles.completedBadge}>✓ Completed</Text>
                )}
              </View>
              <Text style={styles.stageTitle}>{item.title}</Text>
              <Text style={styles.stageDescription}>{item.description}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        <Pressable style={styles.doneButton} onPress={handleBackToGoals}>
          <Text style={styles.doneText}>View All Goals</Text>
        </Pressable>
      </View>
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
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  stageNumber: { fontSize: 14, fontWeight: "700", color: "#63D1E6" },
  completedBadge: { fontSize: 14, fontWeight: "600", color: "#10B981" },
  stageTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  stageDescription: { fontSize: 14, color: "#4B5563" },
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
