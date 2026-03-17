import React, { useEffect } from "react";
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
import { useGoal } from "../../../src/features/goal/goal.context";
import { useAuth } from "../../../src/hooks/useAuth";

export default function GoalsHome() {
  const { goals, fetchGoals } = useGoal();

  useEffect(() => {
    fetchGoals();
  }, []);

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
              <Ionicons name="sparkles-outline" size={18} color="#9c9c9c" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.hTitle}>Your Goals</Text>
          
          </View>

          {/* Goals list */}
          <View style={styles.listWrap}>
            {goals.map((g) => (
              <GoalListCard
                key={g.id}
                goal={g}
                onPress={() => router.push(`/tabs/goal/roadmap?id=${g.id}`)}
              />
            ))}
          </View>

          {/* Spacer so list doesn't hide behind bottom button */}
          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Bottom Create Button */}
        <View style={styles.bottomBar}>
          <Pressable
            onPress={() => router.push("/tabs/goal/chat")}
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

/* ========================= */
/*     GOAL LIST CARD        */
/* ========================= */

function GoalListCard({
  goal,
  onPress,
}: {
  goal: {
    id: string;
    title: string;
    description?: string;
    stages: Array<{ completed: boolean }>;
  };
  onPress: () => void;
}) {
  // Calculate progress
  const totalStages = goal.stages.length;
  const completedStages = goal.stages.filter((s) => s.completed).length;
  const progressPct =
    totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

  // Determine status
  let statusText = "Just started";
  if (progressPct === 100) statusText = "Completed";
  else if (progressPct > 60) statusText = "Almost there";
  else if (progressPct > 30) statusText = "In progress";

  // Determine status color
  let statusColor = "#A78BFA"; // Just started - Soft Purple
  if (progressPct === 100)
    statusColor = "#10B981"; // Completed - Success Green
  else if (progressPct > 60)
    statusColor = "#3B82F6"; // Almost there - Confident Blue
  else if (progressPct > 30) statusColor = "#F59E0B"; // In progress - Motivational Amber

  const { user } = useAuth();
  useEffect(() => {
    console.log(user?.userId);
  }, [user]);

  return (
    <Pressable onPress={onPress} style={styles.goalCard}>
      {/* left progress ring */}
      <View style={styles.ring}>
        <Text style={styles.ringText}>{progressPct}%</Text>
      </View>

      {/* right info */}
      <View style={{ flex: 1 }}>
        <Text style={styles.goalTitle}>{goal.title}</Text>

        <View style={styles.metaRow}>
          <View style={[styles.pill, { backgroundColor: statusColor }]}>
            <Text style={styles.pillText}>
              {completedStages}/{totalStages} stages
            </Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusText}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

/* ========================= */
/*          STYLES           */
/* ========================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F6FA" },

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
  listWrap: { marginTop: 14 },
  goalCard: {
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
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
    borderColor: "#E6E6E6",
    alignItems: "center",
    justifyContent: "center",
  },
  ringText: { fontSize: 12, fontWeight: "900", color: "#333" },

  goalTitle: { fontSize: 16, fontWeight: "900", color: "#111" },

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
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 7,
  },
  createText: { fontSize: 17, fontWeight: "900", color: "#fff" },
});

