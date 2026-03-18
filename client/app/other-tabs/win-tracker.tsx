import React, { useCallback, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { useGoal } from "../../src/features/goal/goal.context";
import { useAuth } from "../../src/hooks/useAuth";
import { getCalendar } from "../../src/services/habit.service";
import type { CalendarData } from "../../src/features/habit/habit.types";

const { width } = Dimensions.get("window");

// ---------- Types ----------
interface WinCategory {
  name: string;
  percentage: number;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}

// ---------- Main Screen ----------
export default function WinTrackerScreen() {
  const { user } = useAuth();
  const { goals, fetchGoals } = useGoal();
  const [habitCalendar, setHabitCalendar] = useState<CalendarData>({});

  useFocusEffect(
    useCallback(() => {
      fetchGoals();
      if (user) {
        getCalendar()
          .then(setHabitCalendar)
          .catch(() => {});
      }
    }, [fetchGoals, user]),
  );

  // ---- Monthly category scores ----
  const winCategories = useMemo<WinCategory[]>(() => {
    const now = new Date();
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const monthDays = Object.entries(habitCalendar).filter(([d]) => d.startsWith(prefix));
    const dayCount = Math.max(monthDays.length, 1);

    const catScore = (cat: "spiritual" | "mental" | "physical") => {
      const total = monthDays.reduce((s, [, scores]) => s + (scores?.[cat] ?? 0), 0);
      return Math.round((total / dayCount) * 100);
    };

    const allStages = (goals ?? []).flatMap((g) => g.stages ?? []);
    const goalPct = allStages.length > 0
      ? Math.round((allStages.filter((s) => s.completed).length / allStages.length) * 100)
      : 0;

    return [
      { name: "Mental", percentage: catScore("mental"), color: "#E53935", icon: "bulb-outline" },
      { name: "Physical", percentage: catScore("physical"), color: "#2196F3", icon: "fitness-outline" },
      { name: "Spiritual", percentage: catScore("spiritual"), color: "#4CAF50", icon: "leaf-outline" },
      { name: "Goal Path", percentage: goalPct, color: "#B5A993", icon: "flag-outline" },
    ];
  }, [habitCalendar, goals]);

  const totalWinPct = useMemo(() => {
    const sum = winCategories.reduce((s, c) => s + c.percentage, 0);
    return Math.round(sum / Math.max(winCategories.length, 1));
  }, [winCategories]);

  // ---- Daily breakdown for current month ----
  const dailyBreakdown = useMemo(() => {
    const now = new Date();
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const monthDays = Object.entries(habitCalendar)
      .filter(([d]) => d.startsWith(prefix))
      .sort(([a], [b]) => b.localeCompare(a)); // most recent first

    return monthDays.map(([date, scores]) => {
      const s = scores?.spiritual ?? 0;
      const m = scores?.mental ?? 0;
      const p = scores?.physical ?? 0;
      const avg = Math.round(((s + m + p) / 3) * 100);
      return { date, spiritual: s, mental: m, physical: p, avg };
    });
  }, [habitCalendar]);

  const monthName = new Date().toLocaleString("default", { month: "long" });

  return (
    <View style={styles.container}>
      {/* Dynamic Header */}
      <LinearGradient
        colors={["#B5A993", "#8C7F6A"]}
        style={styles.heroBackground}
      >
        <SafeAreaView>
          <View style={styles.headerTop}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.headerTitle}>Overview</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroSubtitle}>{monthName} Performance</Text>
            <View style={styles.scoreContainer}>
              <Text style={styles.heroScore}>{totalWinPct}</Text>
              <Text style={styles.heroScorePercent}>%</Text>
            </View>
            <Text style={styles.heroDescription}>Overall Win Rate</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories Grid - 2x2 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>

        <View style={styles.twoColumnGrid}>
          {/* Row 1 */}
          <View style={styles.gridRow}>
            {winCategories.slice(0, 2).map((cat) => (
              <View key={cat.name} style={styles.gridItem}>
                <View style={styles.catHeader}>
                  <View style={[styles.catIconContainer, { backgroundColor: cat.color + "1A" }]}>
                    <Ionicons name={cat.icon} size={20} color={cat.color} />
                  </View>
                  <Text style={styles.catPercentage}>{cat.percentage}%</Text>
                </View>
                <Text style={styles.catName}>{cat.name}</Text>

                {/* Progress Bar */}
                <View style={styles.progressBarBg}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { width: `${cat.percentage}%`, backgroundColor: cat.color }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Row 2 */}
          <View style={styles.gridRow}>
            {winCategories.slice(2, 4).map((cat) => (
              <View key={cat.name} style={styles.gridItem}>
                <View style={styles.catHeader}>
                  <View style={[styles.catIconContainer, { backgroundColor: cat.color + "1A" }]}>
                    <Ionicons name={cat.icon} size={20} color={cat.color} />
                  </View>
                  <Text style={styles.catPercentage}>{cat.percentage}%</Text>
                </View>
                <Text style={styles.catName}>{cat.name}</Text>

                {/* Progress Bar */}
                <View style={styles.progressBarBg}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { width: `${cat.percentage}%`, backgroundColor: cat.color }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Daily Breakdown */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Breakdown</Text>
        </View>

        <View style={styles.dailyContainer}>
          {dailyBreakdown.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#B5A993" style={{ opacity: 0.5 }} />
              <Text style={styles.emptyStateText}>No habit data this month yet</Text>
            </View>
          ) : (
            dailyBreakdown.map((day, index) => (
              <View key={day.date} style={[styles.dayRow, index === dailyBreakdown.length - 1 && styles.dayRowLast]}>
                <View style={styles.dayDateContainer}>
                  <Text style={styles.dayDateNum}>{new Date(day.date).getDate()}</Text>
                  <Text style={styles.dayDateMon}>{monthName.substring(0, 3)}</Text>
                </View>
                
                <View style={styles.dayContent}>
                  <View style={styles.dayScoreHeader}>
                    <Text style={styles.dayScoreLabel}>Score</Text>
                    <Text style={styles.dayScoreValue}>{day.avg}%</Text>
                  </View>
                  
                  <View style={styles.stackedBarContainer}>
                    {day.spiritual > 0 && <View style={[styles.stackedSegment, { flex: day.spiritual, backgroundColor: "#4CAF50" }]} />}
                    {day.mental > 0 && <View style={[styles.stackedSegment, { flex: day.mental, backgroundColor: "#E53935" }]} />}
                    {day.physical > 0 && <View style={[styles.stackedSegment, { flex: day.physical, backgroundColor: "#2196F3" }]} />}
                    {(day.spiritual + day.mental + day.physical === 0) && (
                      <View style={[styles.stackedSegment, { flex: 1, backgroundColor: "#E5DFD3" }]} />
                    )}
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F1E7",
  },
  heroBackground: {
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Roboto_500Medium",
    color: "#FFFFFF",
  },
  heroContent: {
    alignItems: "center",
    marginTop: 20,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: "Roboto_500Medium",
    color: "rgba(255,255,255,0.8)",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
  },
  heroScore: {
    fontSize: 72,
    fontFamily: "Roboto_700Bold",
    color: "#FFFFFF",
    lineHeight: 80,
  },
  heroScorePercent: {
    fontSize: 32,
    fontFamily: "Roboto_500Medium",
    color: "rgba(255,255,255,0.8)",
    marginTop: 10,
    marginLeft: 4,
  },
  heroDescription: {
    fontSize: 16,
    fontFamily: "Roboto_400Regular",
    color: "rgba(255,255,255,0.9)",
    marginTop: -5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Roboto_700Bold",
    color: "#2E2A26",
  },
  twoColumnGrid: {
    gap: 15,
    marginBottom: 24,
  },
  gridRow: {
    flexDirection: "row",
    gap: 12,
  },
  gridItem: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  catHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  catIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  catPercentage: {
    fontSize: 18,
    fontFamily: "Roboto_700Bold",
    color: "#2E2A26",
  },
  catName: {
    fontSize: 15,
    fontFamily: "Roboto_500Medium",
    color: "#6B645C",
    marginBottom: 12,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#E5DFD3",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  dailyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  emptyState: {
    paddingVertical: 30,
    alignItems: "center",
  },
  emptyStateText: {
    color: "#8C7F6A",
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    marginTop: 10,
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F6F1E7",
  },
  dayRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 8,
  },
  dayDateContainer: {
    width: 45,
    alignItems: "center",
    marginRight: 15,
    backgroundColor: "#F6F1E7",
    paddingVertical: 8,
    borderRadius: 12,
  },
  dayDateNum: {
    fontSize: 18,
    fontFamily: "Roboto_700Bold",
    color: "#2E2A26",
  },
  dayDateMon: {
    fontSize: 11,
    fontFamily: "Roboto_500Medium",
    color: "#8C7F6A",
    textTransform: "uppercase",
  },
  dayContent: {
    flex: 1,
  },
  dayScoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dayScoreLabel: {
    fontSize: 14,
    fontFamily: "Roboto_500Medium",
    color: "#6B645C",
  },
  dayScoreValue: {
    fontSize: 16,
    fontFamily: "Roboto_700Bold",
    color: "#2E2A26",
  },
  stackedBarContainer: {
    height: 8,
    flexDirection: "row",
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#E5DFD3",
  },
  stackedSegment: {
    height: "100%",
  },
});
