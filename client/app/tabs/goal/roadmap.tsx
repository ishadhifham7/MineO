import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Checkbox from "expo-checkbox";
import { useGoal } from "../../../src/features/goal/goal.context";
import { toggleStageCompletionApi } from "../../../src/features/goal/goal.api";

const GoalRoadmapScreen: React.FC = () => {
  const { currentGoal, goals, upsertGoal } = useGoal();
  const params = useLocalSearchParams();

  const goalId = params.id as string | undefined;
  const displayGoal = goalId
    ? goals.find((goal) => goal.id === goalId)
    : currentGoal || goals[0];

  const [localStages, setLocalStages] = useState(
    displayGoal ? displayGoal.stages.map((stage) => ({ ...stage })) : [],
  );
  const [isSavingStage, setIsSavingStage] = useState(false);

  React.useEffect(() => {
    if (displayGoal) {
      setLocalStages(displayGoal.stages.map((stage) => ({ ...stage })));
    }
  }, [displayGoal]);

  const { completedCount, progressPercent } = useMemo(() => {
    const completed = localStages.filter((stage) => stage.completed).length;
    const total = localStages.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      completedCount: completed,
      progressPercent: percent,
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
    } catch (error) {
      setLocalStages((prev) =>
        prev.map((item) =>
          item.id === stageId ? { ...item, completed: stage.completed } : item,
        ),
      );
    } finally {
      setIsSavingStage(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Goal Roadmap</Text>
        <Pressable onPress={handleBackToGoals} style={styles.headerSaveButton}>
          <Text style={styles.headerSaveText}>Save</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{displayGoal.title}</Text>
        <Text style={styles.description}>{displayGoal.description}</Text>

                <View style={styles.stageContentCol}>
                  <Text
                    style={[
                      styles.stageTitle,
                      stage.completed && styles.stageTitleCompleted,
                    ]}
                  >
                    {stage.title}
                  </Text>
                  <Text style={styles.stageDescription}>{stage.description}</Text>
                </View>

                <Checkbox
                  value={item.completed}
                  onValueChange={() => handleToggleStage(item.id)}
                  color={item.completed ? "#00313b" : undefined}
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
      </ScrollView>
    </View>
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
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.3,
  },

  headerSaveButton: {
    backgroundColor: "#44BBD4",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minWidth: 62,
    alignItems: "center",
  },

  headerSaveText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  noDraftText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 100,
    marginBottom: 20,
    color: "#64748B",
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
  createAnotherButton: {
    marginTop: 6,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9D2C5",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  createAnotherText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2E2A26",
  },
});
