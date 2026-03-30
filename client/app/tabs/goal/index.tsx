import React, { useEffect, useMemo } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useGoal } from "../../../src/features/goal/goal.context";
import {
  HomeStyleScreen,
  SectionCard,
} from "../../../src/components/ui/HomeStyleScreen";
import { useFocusEffect } from "@react-navigation/native";

type GoalItem = {
  id: string;
  title: string;
  description?: string;
  stages: Array<{ completed: boolean }>;
};

function getStatusMeta(progressPct: number) {
  if (progressPct >= 100) {
    return {
      text: "Completed",
      color: "#4CAF50",
      trackColor: "#D9F2DC",
    };
  }

  if (progressPct >= 65) {
    return {
      text: "Almost there",
      color: "#2196F3",
      trackColor: "#D8ECFB",
    };
  }

  if (progressPct >= 30) {
    return {
      text: "In progress",
      color: "#B5A993",
      trackColor: "#ECE6DC",
    };
  }

  return {
    text: "Just started",
    color: "#8C7F6A",
    trackColor: "#E9E3DA",
  };
}

export default function GoalsHome() {
  const scrollRef = React.useRef<import("react-native").ScrollView | null>(
    null,
  );
  const { goals, fetchGoals } = useGoal();

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  useFocusEffect(
    React.useCallback(() => {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: false });
      });
    }, []),
  );

  const { completedCount, activeCount } = useMemo(() => {
    const completed = goals.filter((goal: GoalItem) => {
      const total = goal.stages.length;
      if (total === 0) {
        return false;
      }
      return goal.stages.every((stage) => stage.completed);
    }).length;

    return {
      completedCount: completed,
      activeCount: Math.max(goals.length - completed, 0),
    };
  }, [goals]);

  return (
    <HomeStyleScreen
      scrollRef={scrollRef}
      kicker="Goal Plan"
      title="Your Goals"
      subtitle="Keep moving forward, one milestone at a time"
      hideHero
      stats={[
        { value: goals.length, label: "Total" },
        { value: activeCount, label: "Active" },
        { value: completedCount, label: "Done" },
      ]}
    >
      <LinearGradient
        colors={["#2E2A26", "#6B645C", "#B5A993"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.flowHero}
      >
        <Text style={styles.flowHeroKicker}>Goal Plan</Text>
        <Text style={styles.flowHeroTitle}>Your Goals</Text>
        <Text style={styles.flowHeroSubtitle}>
          Keep moving forward, one milestone at a time
        </Text>

        <View style={styles.flowHeroStats}>
          <View style={styles.flowHeroStatPill}>
            <Text style={styles.flowHeroStatValue}>{goals.length}</Text>
            <Text style={styles.flowHeroStatLabel}>Total</Text>
          </View>
          <View style={styles.flowHeroStatPill}>
            <Text style={styles.flowHeroStatValue}>{activeCount}</Text>
            <Text style={styles.flowHeroStatLabel}>Active</Text>
          </View>
          <View style={styles.flowHeroStatPill}>
            <Text style={styles.flowHeroStatValue}>{completedCount}</Text>
            <Text style={styles.flowHeroStatLabel}>Done</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.ctaWrap}>
        <Pressable
          onPress={() => router.push("/tabs/goal/chat")}
          style={({ pressed }) => [pressed && { opacity: 0.9 }]}
        >
          <LinearGradient
            colors={["#2E2A26", "#4A433A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.createBtn}
          >
            <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.createText}>Create New Goal</Text>
          </LinearGradient>
        </Pressable>
      </View>

      <SectionCard>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Goal Progress</Text>
            <Text style={styles.sectionSubtitle}>
              Tap any goal to open roadmap
            </Text>
          </View>
          <View style={styles.countPill}>
            <Text style={styles.countPillText}>{goals.length}</Text>
          </View>
        </View>

        <View style={styles.listWrap}>
          {goals.length > 0 ? (
            goals.map((goal: GoalItem) => (
              <GoalListCard
                key={goal.id}
                goal={goal}
                onPress={() => router.push(`/tabs/goal/roadmap?id=${goal.id}`)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="flag-outline" size={34} color="#8C7F6A" />
              </View>
              <Text style={styles.emptyTitle}>No goals yet</Text>
              <Text style={styles.emptySubtitle}>
                Create your first goal and start tracking your progress.
              </Text>
            </View>
          )}
        </View>
      </SectionCard>
    </HomeStyleScreen>
  );
}

/* ========================= */
/*     GOAL LIST CARD        */
/* ========================= */

function GoalListCard({
  goal,
  onPress,
}: {
  goal: GoalItem;
  onPress: () => void;
}) {
  const totalStages = goal.stages.length;
  const completedStages = goal.stages.filter((stage) => stage.completed).length;
  const progressPct =
    totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

  const status = getStatusMeta(progressPct);

  return (
    <Pressable onPress={onPress} style={styles.goalCard}>
      <View style={[styles.progressRing, { borderColor: status.color }]}>
        <Text style={[styles.progressRingText, { color: status.color }]}>
          {progressPct}%
        </Text>
      </View>

      <View style={styles.goalInfo}>
        <View style={styles.goalTitleRow}>
          <Text numberOfLines={1} style={styles.goalTitle}>
            {goal.title}
          </Text>
          <View
            style={[styles.statusBadge, { backgroundColor: status.trackColor }]}
          >
            <Text style={[styles.statusBadgeText, { color: status.color }]}>
              {status.text}
            </Text>
          </View>
        </View>

        {goal.description ? (
          <Text numberOfLines={2} style={styles.goalDescription}>
            {goal.description}
          </Text>
        ) : null}

        <View style={styles.goalMetaRow}>
          <Text style={styles.goalMetaText}>
            {completedStages}/{totalStages} stages completed
          </Text>
        </View>

        <View
          style={[styles.progressTrack, { backgroundColor: status.trackColor }]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPct}%`,
                backgroundColor: status.color,
              },
            ]}
          />
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#8C7F6A" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flowHero: {
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  flowHeroKicker: {
    fontSize: 11,
    color: "rgba(255,255,255,0.82)",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontFamily: "Roboto_500Medium",
  },
  flowHeroTitle: {
    marginTop: 6,
    fontSize: 28,
    color: "#FFFFFF",
    fontFamily: "Roboto_500Medium",
    lineHeight: 34,
  },
  flowHeroSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Roboto_400Regular",
  },
  flowHeroStats: {
    marginTop: 16,
    flexDirection: "row",
    gap: 8,
  },
  flowHeroStatPill: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  flowHeroStatValue: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "Roboto_500Medium",
  },
  flowHeroStatLabel: {
    marginTop: 2,
    fontSize: 11,
    color: "rgba(255,255,255,0.84)",
    fontFamily: "Roboto_400Regular",
  },
  sectionHeader: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Roboto_700Bold",
    fontWeight: "700",
    color: "#2E2A26",
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: "Roboto_400Regular",
    color: "#6B645C",
  },
  countPill: {
    minWidth: 34,
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 10,
    backgroundColor: "#E6DED0",
    alignItems: "center",
    justifyContent: "center",
  },
  countPillText: {
    fontSize: 13,
    fontFamily: "Roboto_700Bold",
    fontWeight: "700",
    color: "#5A5246",
  },

  /* Header */
  headerRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  headerText: { marginLeft: 12 },
  hTitle: { fontSize: 26, fontWeight: "800", color: "#111" },
  hSub: { marginTop: 6, fontSize: 14, color: "#6B6B6B" },

  /* Goals list */
  listWrap: { marginTop: 14, gap: 12 },
  goalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5DFD3",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  progressRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  progressRingText: {
    fontSize: 13,
    fontFamily: "Roboto_700Bold",
    fontWeight: "700",
  },
  goalInfo: {
    flex: 1,
  },
  goalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  goalTitle: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Roboto_700Bold",
    fontWeight: "700",
    color: "#2E2A26",
  },
  statusBadge: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: "Roboto_600SemiBold",
    fontWeight: "600",
  },
  goalDescription: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: "Roboto_400Regular",
    color: "#6B645C",
  },
  goalMetaRow: {
    marginTop: 8,
  },
  goalMetaText: {
    fontSize: 12,
    fontFamily: "Roboto_500Medium",
    fontWeight: "500",
    color: "#8C7F6A",
  },
  progressTrack: {
    marginTop: 8,
    height: 7,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  emptyState: {
    marginTop: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5DFD3",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 42,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0EADF",
  },
  emptyTitle: {
    marginTop: 14,
    fontSize: 20,
    fontFamily: "Roboto_700Bold",
    fontWeight: "700",
    color: "#2E2A26",
  },
  emptySubtitle: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Roboto_400Regular",
    color: "#6B645C",
  },
  ctaWrap: {
    marginTop: 0,
    marginHorizontal: 8,
  },
  createBtn: {
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  createText: {
    fontSize: 16,
    fontFamily: "Roboto_600SemiBold",
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
