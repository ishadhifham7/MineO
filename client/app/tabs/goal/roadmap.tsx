import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Checkbox from "expo-checkbox";
import { useGoal } from "../../../src/features/goal/goal.context";
import {
  deleteGoalApi,
  toggleStageCompletionApi,
} from "../../../src/features/goal/goal.api";

type GoalStage = {
  id: string;
  title: string;
  description?: string;
  order: number;
  completed: boolean;
};

const GoalRoadmapScreen: React.FC = () => {
  const { currentGoal, goals, setGoals, setCurrentGoal, upsertGoal } =
    useGoal();
  const params = useLocalSearchParams();

  const goalId = params.id as string | undefined;
  const displayGoal = goalId
    ? goals.find((goal) => goal.id === goalId)
    : currentGoal || goals[0];

  const [localStages, setLocalStages] = useState<GoalStage[]>(
    displayGoal ? displayGoal.stages.map((stage) => ({ ...stage })) : [],
  );
  const [isSavingStage, setIsSavingStage] = useState(false);
  const [isDeletingGoal, setIsDeletingGoal] = useState(false);

  React.useEffect(() => {
    if (displayGoal) {
      setLocalStages(displayGoal.stages.map((stage) => ({ ...stage })));
    }
  }, [displayGoal]);

  const { completedCount, progressPercent } = useMemo(() => {
    const completed = localStages.filter((stage) => stage.completed).length;
    const total = localStages.length;
    return {
      completedCount: completed,
      progressPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [localStages]);

  if (!displayGoal) {
    return (
      <SafeAreaView style={styles.safe} edges={["left", "right"]}>
        <View style={styles.emptyRoot}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="map-outline" size={34} color="#8C7F6A" />
          </View>
          <Text style={styles.emptyTitle}>
            {goalId ? "Goal not found" : "No goal available"}
          </Text>
          <Text style={styles.emptySubtitle}>
            {goalId
              ? "This roadmap is not available right now."
              : "Create a new goal to start your roadmap."}
          </Text>

          <Pressable
            style={styles.emptyButton}
            onPress={() => router.push("/tabs/goal/chat")}
          >
            <Text style={styles.emptyButtonText}>Create New Goal</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleToggleStage = async (stageId: string) => {
    const stage = localStages.find((item) => item.id === stageId);
    if (!stage || isSavingStage) {
      return;
    }

    const nextCompleted = !stage.completed;

    setLocalStages((prev) =>
      prev.map((item) =>
        item.id === stageId ? { ...item, completed: nextCompleted } : item,
      ),
    );

    setIsSavingStage(true);
    try {
      const updatedGoal = await toggleStageCompletionApi(
        displayGoal.id,
        stageId,
        nextCompleted,
      );
      upsertGoal(updatedGoal);
    } catch {
      setLocalStages((prev) =>
        prev.map((item) =>
          item.id === stageId ? { ...item, completed: stage.completed } : item,
        ),
      );
    } finally {
      setIsSavingStage(false);
    }
  };

  const confirmDeleteGoal = async () => {
    if (!displayGoal || isDeletingGoal) {
      return;
    }

    setIsDeletingGoal(true);
    try {
      await deleteGoalApi(displayGoal.id);

      setGoals((prev) => prev.filter((goal) => goal.id !== displayGoal.id));
      if (currentGoal?.id === displayGoal.id) {
        setCurrentGoal(null);
      }

      router.replace("/tabs/goal");
    } catch (error: any) {
      Alert.alert("Delete Failed", error?.message || "Failed to delete goal.");
    } finally {
      setIsDeletingGoal(false);
    }
  };

  const handleDeleteGoalPress = () => {
    if (!displayGoal || isDeletingGoal) {
      return;
    }

    Alert.alert(
      "Delete Goal",
      "Are you sure you want to permanently delete this goal? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            void confirmDeleteGoal();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <LinearGradient
            colors={["#B5A993", "#8C7F6A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.heroTopRow}>
              <Pressable
                style={styles.heroAction}
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={16} color="#FFFFFF" />
                <Text style={styles.heroActionText}>Back</Text>
              </Pressable>

              <Pressable
                style={styles.heroAction}
                onPress={() => router.push("/tabs/goal")}
              >
                <Ionicons name="checkmark-done" size={16} color="#FFFFFF" />
                <Text style={styles.heroActionText}>Save</Text>
              </Pressable>
            </View>

            <Text style={styles.heroTitle}>Goal Roadmap</Text>
            <Text style={styles.heroSubtitle}>{displayGoal.title}</Text>

            <View style={styles.heroProgressWrap}>
              <View style={styles.heroProgressTopRow}>
                <Text style={styles.heroProgressLabel}>Progress</Text>
                <Text style={styles.heroProgressValue}>{progressPercent}%</Text>
              </View>
              <View style={styles.heroProgressTrack}>
                <View
                  style={[
                    styles.heroProgressFill,
                    { width: `${progressPercent}%` },
                  ]}
                />
              </View>
              <Text style={styles.heroProgressMeta}>
                {completedCount}/{localStages.length} stages completed
              </Text>
            </View>
          </LinearGradient>

          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {displayGoal.description || "No description provided yet."}
            </Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Stages</Text>
            {isSavingStage ? (
              <View style={styles.savingRow}>
                <ActivityIndicator size="small" color="#8C7F6A" />
                <Text style={styles.savingText}>Saving...</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.stagesList}>
            {localStages.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.stageCard,
                  item.completed && styles.stageCardCompleted,
                ]}
              >
                <View style={styles.stageLeftCol}>
                  <View
                    style={[
                      styles.orderBadge,
                      item.completed && styles.orderBadgeCompleted,
                    ]}
                  >
                    <Text
                      style={[
                        styles.orderBadgeText,
                        item.completed && styles.orderBadgeTextCompleted,
                      ]}
                    >
                      {item.order}
                    </Text>
                  </View>
                </View>

                <View style={styles.stageContentCol}>
                  <Text
                    style={[
                      styles.stageTitle,
                      item.completed && styles.stageTitleCompleted,
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text style={styles.stageDescription}>
                    {item.description}
                  </Text>
                </View>

                <Checkbox
                  value={item.completed}
                  onValueChange={() => handleToggleStage(item.id)}
                  color={item.completed ? "#2F8B43" : undefined}
                  style={styles.stageCheckbox}
                />
              </View>
            ))}
          </View>

          <Pressable
            style={[
              styles.deleteGoalButton,
              isDeletingGoal && styles.deleteGoalButtonDisabled,
            ]}
            onPress={handleDeleteGoalPress}
            disabled={isDeletingGoal}
          >
            {isDeletingGoal ? (
              <ActivityIndicator size="small" color="#7A1E20" />
            ) : (
              <Ionicons name="trash-outline" size={18} color="#7A1E20" />
            )}
            <Text style={styles.deleteGoalText}>
              {isDeletingGoal ? "Deleting..." : "Delete Goal"}
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default GoalRoadmapScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F6F1E7",
  },
  screen: {
    flex: 1,
    backgroundColor: "#F6F1E7",
  },
  hero: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  heroAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  heroActionText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginTop: 6,
  },
  heroProgressWrap: {
    marginTop: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    padding: 12,
  },
  heroProgressTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroProgressLabel: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 13,
    fontWeight: "500",
  },
  heroProgressValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  heroProgressTrack: {
    marginTop: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.3)",
    overflow: "hidden",
  },
  heroProgressFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
  },
  heroProgressMeta: {
    marginTop: 8,
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
    gap: 14,
  },
  descriptionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5DFD3",
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8C7F6A",
  },
  descriptionText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#2E2A26",
  },
  sectionHeader: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E2A26",
  },
  savingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  savingText: {
    fontSize: 12,
    color: "#8C7F6A",
    fontWeight: "500",
  },
  stagesList: {
    gap: 12,
  },
  stageCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5DFD3",
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  stageCardCompleted: {
    backgroundColor: "#F5FBF6",
    borderColor: "#CDE8D1",
  },
  stageLeftCol: {
    justifyContent: "center",
    alignItems: "center",
  },
  orderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ECE6DC",
  },
  orderBadgeCompleted: {
    backgroundColor: "#DDF2E1",
  },
  orderBadgeText: {
    color: "#6B645C",
    fontSize: 14,
    fontWeight: "700",
  },
  orderBadgeTextCompleted: {
    color: "#2F8B43",
  },
  stageContentCol: {
    flex: 1,
  },
  stageTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2E2A26",
  },
  stageTitleCompleted: {
    color: "#2F8B43",
  },
  stageDescription: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: "#6B645C",
  },
  stageCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
  },
  deleteGoalButton: {
    marginTop: 6,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F1C6CC",
    backgroundColor: "#FFF7F8",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  deleteGoalButtonDisabled: {
    opacity: 0.7,
  },
  deleteGoalText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#7A1E20",
  },
  emptyRoot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ECE6DC",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: "700",
    color: "#2E2A26",
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: "#6B645C",
  },
  emptyButton: {
    marginTop: 16,
    backgroundColor: "#2E2A26",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
