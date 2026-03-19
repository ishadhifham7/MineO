import React, { useMemo } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import CreateGoal from "../../src/components/goal/CreateGoal";

type Goal = {
  id: string;
  title: string;
  category: string;
  stageName: string;
  progressPct: number;
  statusText: string;
  stagesTotal?: number;
  stagesDone?: number;
  sub?: string;
};

export default function GoalsRoute() {
  const goals: Goal[] = useMemo(
    () => [
      {
        id: "1",
        title: "dsc",
        category: "Physical",
        stageName: "Foundation & Awareness",
        progressPct: 0,
        statusText: "Just started",
        stagesTotal: 4,
        stagesDone: 0,
        sub: "Foundation & Awareness",
      },
      {
        id: "2",
        title: "Gym",
        category: "Physical",
        stageName: "Fitness & Health",
        progressPct: 0,
        statusText: "Just started",
        stagesTotal: 3,
        stagesDone: 0,
        sub: "Fitness & Health",
      },
      {
        id: "3",
        title: "Reading",
        category: "Personal",
        stageName: "Knowledge & Growth",
        progressPct: 0,
        statusText: "Just started",
        stagesTotal: 2,
        stagesDone: 0,
        sub: "Knowledge & Growth",
      },
    ],
    [],
  );

  // State to control which sub-screen is shown
  const [screen, setScreen] = React.useState<"home" | "create">("home");

  // Navigation handlers
  const handleCreateGoal = () => setScreen("create");
  const handleGoalContinue = (goal: string) => {
    // Here you could add the goal to state or backend
    alert(`Your goal: ${goal}`);
    setScreen("home");
  };
  const handleBack = () => setScreen("home");

  if (screen === "create") {
    return <CreateGoal onBack={handleBack} />;
  }
  // Home screen (default)
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerIcon}>
              <Ionicons name="sparkles-outline" size={18} color="#ffffff" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.hTitle}>Your Goals</Text>
              <Text style={styles.hSub}>Small steps create big change</Text>
            </View>
          </View>

          {/* Goals list */}
          <View style={styles.listWrap}>
            {goals.map((g) => (
              <GoalListCard
                key={g.id}
                goal={g}
                onPress={() => router.push(`/goal/${g.id}`)}
              />
            ))}
          </View>

          {/* Spacer so list doesn't hide behind bottom button */}
          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Bottom Create Button */}
        <View style={styles.bottomBar}>
          <Pressable
            onPress={handleCreateGoal}
            style={({ pressed }) => [pressed && { opacity: 0.92 }]}
          >
            <LinearGradient
              colors={["#63D1E6", "#B39DDB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.createBtn}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.createText}>Create New Goal</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function GoalListCard({
  goal,
  onPress,
}: {
  goal: {
    id: string;
    title: string;
    category: string;
    stageName: string;
    progressPct: number;
    statusText: string;
  };
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.goalCard}>
      {/* left progress ring */}
      <View style={styles.ring}>
        <Text style={styles.ringText}>{goal.progressPct}%</Text>
      </View>

      {/* right info */}
      <View style={{ flex: 1 }}>
        <Text style={styles.goalTitle}>{goal.title}</Text>

        <View style={styles.metaRow}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{goal.category}</Text>
          </View>
          <Text style={styles.metaText}>{goal.stageName}</Text>
        </View>

        <View style={styles.statusRow}>
          <View style={styles.dot} />
          <Text style={styles.statusText}>{goal.statusText}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B1220" },

  screen: { flex: 1 },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 14,
  },

  /* Header */
  headerRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#F3F7FF",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  headerText: { marginLeft: 12 },
  hTitle: { fontSize: 26, fontWeight: "800", color: "#F3F7FF" },
  hSub: { marginTop: 6, fontSize: 14, color: "#6B6B6B" },

  /* Goals list */
  listWrap: { marginTop: 14 },
  goalCard: {
    marginTop: 12,
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: "#F3F7FF",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  ring: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 3,
    borderColor: "#2A3A58",
    alignItems: "center",
    justifyContent: "center",
  },
  ringText: { fontSize: 12, fontWeight: "900", color: "#DCE6F6" },

  goalTitle: { fontSize: 16, fontWeight: "900", color: "#F3F7FF" },

  metaRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pill: {
    backgroundColor: "#9BE0B0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pillText: { fontSize: 11, fontWeight: "900", color: "#1F4D2B" },
  metaText: { fontSize: 12, fontWeight: "700", color: "#6B6B6B" },

  statusRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#7ACD8C" },
  statusText: { fontSize: 12, fontWeight: "700", color: "#6B6B6B" },

  /* Bottom create button */
  bottomBar: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: Platform.OS === "ios" ? 24 : 18,
  },
  createBtn: {
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    shadowColor: "#F3F7FF",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 7,
  },
  createText: { fontSize: 17, fontWeight: "900", color: "#fff" },
});

