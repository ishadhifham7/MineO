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
import {
  useGoal,
  DraftGoal,
  Stage,
} from "../../../src/features/goal/goal.context";
import { generateGoalApi } from "../../../src/features/goal/goal.api";

const GoalRoadmapScreen: React.FC = () => {
  const { draftGoal, setDraftGoal, setCurrentGoal, setGoals } = useGoal();

  if (!draftGoal) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDraftText}>No goal plan available.</Text>
      </View>
    );
  }

  const handleGenerateFinalGoal = async () => {
    try {
      const createdGoal = await generateGoalApi(draftGoal);
      setCurrentGoal(createdGoal);
      setGoals((prev) => [...prev, createdGoal]);
      setDraftGoal(null);
      Alert.alert("Success", "Goal saved successfully!");
      router.push("/goal/screens/GoalListScreen"); // Redirect to goals list or wherever you want
    } catch (error) {
      console.error("Failed to generate final goal:", error);
      Alert.alert("Error", "Could not save goal. Try again.");
    }
  };

  const handleContinueChat = () => {
    // Convert draft stages back to conversation messages
    // This allows the user to edit/refine the plan in chat
    const conversationMessages = draftGoal.stages.map(
      (stage: Stage, index: number) => ({
        id: `draft-${index}`,
        text: `${stage.title}: ${stage.description}`,
        sender: "ai" as const,
      }),
    );

    // Navigate back to chat screen with draft appended
    router.push({
      pathname: "/goal/screens/GoalChatScreen",
      params: { draftConversation: JSON.stringify(conversationMessages) },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{draftGoal.title}</Text>
      <Text style={styles.description}>{draftGoal.description}</Text>

      <FlatList
        data={draftGoal.stages}
        keyExtractor={(item) => item.order.toString()}
        renderItem={({ item }) => (
          <View style={styles.stageCard}>
            <Text style={styles.stageTitle}>{item.title}</Text>
            <Text style={styles.stageDescription}>{item.description}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Pressable
        style={styles.generateButton}
        onPress={handleGenerateFinalGoal}
      >
        <Text style={styles.generateText}>Generate Final Goal</Text>
      </Pressable>

      <Pressable style={styles.continueButton} onPress={handleContinueChat}>
        <Text style={styles.continueText}>Continue Chat</Text>
      </Pressable>
    </View>
  );
};

export default GoalRoadmapScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 20 },
  noDraftText: { fontSize: 16, textAlign: "center", marginTop: 100 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  description: { fontSize: 16, marginBottom: 16 },
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
});
