import React, { useMemo } from "react";
import { SafeAreaView, StyleSheet, Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type Goal = {
  id: string;
  title: string;
  category: string; // e.g. Physical, Study
  stagesTotal: number;
  stagesDone: number;
};

export default function ProgressScreen() {
  // Replace this with your real goals from store/db
  const goals: Goal[] = useMemo(
    () => [
      { id: "1", title: "dsc", category: "Physical", stagesTotal: 4, stagesDone: 0 },
    ],
    []
  );

  const activeGoals = goals.length;

  const totalXP = 0; // later calculate from check-ins
  const stagesComplete = goals.reduce((sum, g) => sum + g.stagesDone, 0);
  const stagesAhead = 4; // demo like screenshot (later compute)

  // Category aggregation (simple demo)
  const categoryName = "Physical";
  const categoryGoals = goals.filter((g) => g.category === categoryName);
  const categoryGoalCount = categoryGoals.length;

  // Journey card uses first goal (demo)
  const journeyGoal = goals[0];
  const progressPct =
    journeyGoal && journeyGoal.stagesTotal > 0
      ? Math.round((journeyGoal.stagesDone / journeyGoal.stagesTotal) * 100)
      : 0;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backFab}>
          <Ionicons name="arrow-back" size={20} color="#EF4444" />
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.hTitle}>Your Progress</Text>
          <Text style={styles.hSub}>Celebrating your journey</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <StatCard
            value={activeGoals}
            label="Active Goals"
            tone="blue"
          />
          <StatCard
            value={totalXP}
            label="Total XP"
            tone="purple"
          />
          <StatCard
            value={stagesComplete}
            label="Stages Complete"
            tone="green"
          />
          <StatCard
            value={stagesAhead}
            label="Stages Ahead"
            tone="orange"
          />
        </View>

        {/* By Category */}
        <Text style={styles.sectionTitle}>By Category</Text>
        <View style={styles.categoryCard}>
          <View style={styles.categoryRow}>
            <Text style={styles.categoryName}>{categoryName}</Text>
            <Text style={styles.categoryCount}>{categoryGoalCount} goal</Text>
          </View>
          <Text style={styles.categorySub}>0% average progress</Text>
        </View>

        {/* Your Journey */}
        <Text style={styles.sectionTitle}>Your Journey</Text>
        <View style={styles.journeyCard}>
          <Text style={styles.journeyTitle}>{journeyGoal?.title ?? "No goal"}</Text>

          {/* progress bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
          </View>

          <View style={styles.journeyBottomRow}>
            <Text style={styles.journeyMeta}>
              {journeyGoal ? `${journeyGoal.stagesDone} of ${journeyGoal.stagesTotal} stages` : "-"}
            </Text>
            <Text style={styles.journeyMeta}>
              {progressPct}% complete
            </Text>
          </View>
        </View>

        {/* Motivational card */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationIcon}>*</Text>
          <Text style={styles.motivationTitle}>You're doing amazing!</Text>
          <Text style={styles.motivationSub}>
            Every small step is building something bigger
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function StatCard({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: "blue" | "purple" | "green" | "orange";
}) {
  return (
    <View style={[styles.statCard, toneStyles[tone]]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const toneStyles = StyleSheet.create({
  blue: { borderColor: "#2C2C31" },
  purple: { borderColor: "#2C2C31" },
  green: { borderColor: "#2C2C31" },
  orange: { borderColor: "#2C2C31" },
});
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#121212" },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 14,
    paddingHorizontal: 18,
  },

  backFab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1C1C1E",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  headerText: { marginLeft: 14, paddingTop: 2 },
  hTitle: { fontSize: 26, fontWeight: "800", color: "#FFFFFF" },
  hSub: { marginTop: 6, fontSize: 14, color: "#A1A1AA" },

  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
  },

  /* Stats */
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#1C1C1E",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,

    shadowColor: "#000000",
    shadowOpacity: 0.10,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 5,
  },

  statValue: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  statLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "#A1A1AA",
  },

  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  /* Category card */
  categoryCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  categoryName: {
    fontSize: 14,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  categoryCount: {
    fontSize: 13,
    fontWeight: "700",
    color: "#A1A1AA",
  },

  
  categorySub: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "700",
    color: "#A1A1AA",
    alignSelf: "flex-end",
  },


  /* Journey card */
  journeyCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  journeyTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  progressTrack: {
    marginTop: 12,
    height: 8,
    borderRadius: 8,
    backgroundColor: "#232326",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#22C55E",
    borderRadius: 8,
  },

  journeyBottomRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  journeyMeta: {
    fontSize: 12,
    fontWeight: "700",
    color: "#A1A1AA",
  },

  /* Motivation */
  motivationCard: {
    marginTop: 14,
    backgroundColor: "#232326",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2C2C31",
  },

  motivationIcon: { fontSize: 22, marginBottom: 6 },
  motivationTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  motivationSub: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "#A1A1AA",
    textAlign: "center",
  },
});

