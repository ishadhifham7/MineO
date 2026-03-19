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
import Svg, { Circle, G } from "react-native-svg";
import { useFocusEffect } from "@react-navigation/native";
import { useGoal } from "../../src/features/goal/goal.context";
import { useAuth } from "../../src/hooks/useAuth";
import { getCalendar } from "../../src/services/habit.service";
import type { CalendarData } from "../../src/features/habit/habit.types";

const SCREEN_WIDTH = Dimensions.get("window").width;

// ---------- Types ----------
interface WinCategory {
  name: string;
  percentage: number;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}

// ---------- Donut Chart ----------
function DonutChart({
  data,
  size = 180,
  strokeWidth = 22,
  centerLabel,
  centerSub,
}: {
  data: { percentage: number; color: string }[];
  size?: number;
  strokeWidth?: number;
  centerLabel: string;
  centerSub: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  let cumulativePercent = 0;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size}>
        <Circle cx={center} cy={center} r={radius} stroke="#af0000" strokeWidth={strokeWidth} fill="none" />
        <G rotation="-90" origin={`${center}, ${center}`}>
          {data.map((segment, i) => {
            const segmentLength = (segment.percentage / 100) * circumference;
            const offset = circumference - segmentLength;
            const rotation = (cumulativePercent / 100) * 360;
            cumulativePercent += segment.percentage;
            return (
              <Circle
                key={i}
                cx={center}
                cy={center}
                r={radius}
                stroke={segment.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${segmentLength} ${offset}`}
                strokeLinecap="round"
                rotation={rotation}
                origin={`${center}, ${center}`}
              />
            );
          })}
        </G>
      </Svg>
      <View style={styles.donutCenter}>
        <Text style={styles.donutCenterLabel}>{centerLabel}</Text>
        <Text style={styles.donutCenterSub}>{centerSub}</Text>
      </View>
    </View>
  );
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
      { name: "Mental", percentage: catScore("mental"), color: "#FF8A80", icon: "bulb-outline" },
      { name: "Physical", percentage: catScore("physical"), color: "#82B1FF", icon: "fitness-outline" },
      { name: "Spiritual", percentage: catScore("spiritual"), color: "#B9F6CA", icon: "leaf-outline" },
      { name: "Goal Path", percentage: goalPct, color: "#FFE0B2", icon: "flag-outline" },
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
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backFab}>
          <Ionicons name="arrow-back" size={20} color="#111" />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.hTitle}>Win Tracker</Text>
          <Text style={styles.hSub}>{monthName} Overview</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Donut Card */}
        <View style={styles.card}>
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <DonutChart
              data={winCategories.map((c) => ({ percentage: c.percentage, color: c.color }))}
              centerLabel={`${totalWinPct}%`}
              centerSub="TOTAL"
            />
          </View>

          {/* Legend */}
          <View style={styles.legendGrid}>
            {winCategories.map((cat) => (
              <View key={cat.name} style={styles.legendCard}>
                <View style={[styles.legendIconBg, { backgroundColor: cat.color + "30" }]}>
                  <Ionicons name={cat.icon} size={18} color={cat.color} />
                </View>
                <Text style={styles.legendName}>{cat.name}</Text>
                <Text style={styles.legendPct}>{cat.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Daily Breakdown */}
        <Text style={styles.sectionTitle}>Daily Breakdown</Text>
        {dailyBreakdown.length === 0 ? (
          <View style={styles.card}>
            <Text style={{ fontSize: 13, color: "#aaa", textAlign: "center" }}>
              No habit data this month yet
            </Text>
          </View>
        ) : (
          dailyBreakdown.map((day) => (
            <View key={day.date} style={styles.dayRow}>
              <Text style={styles.dayDate}>{day.date.slice(8)}</Text>
              <View style={styles.dayBars}>
                <View style={[styles.dayBarSegment, { flex: day.spiritual, backgroundColor: "#B9F6CA" }]} />
                <View style={[styles.dayBarSegment, { flex: day.mental, backgroundColor: "#FF8A80" }]} />
                <View style={[styles.dayBarSegment, { flex: day.physical, backgroundColor: "#82B1FF" }]} />
                {day.spiritual + day.mental + day.physical === 0 && (
                  <View style={[styles.dayBarSegment, { flex: 1, backgroundColor: "#f0f0f0" }]} />
                )}
              </View>
              <Text style={styles.dayAvg}>{day.avg}%</Text>
            </View>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F5F5" },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 14,
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  backFab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.12)",
    elevation: 4,
  },
  headerText: { marginLeft: 14, paddingTop: 2 },
  hTitle: { fontSize: 26, fontWeight: "800", color: "#111" },
  hSub: { marginTop: 4, fontSize: 14, color: "#6B6B6B" },

  content: { flex: 1, paddingHorizontal: 18 },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    boxShadow: "0px 6px 14px rgba(0,0,0,0.06)",
    elevation: 3,
  },

  donutCenter: {
    position: "absolute",
    alignItems: "center",
  },
  donutCenterLabel: { fontSize: 32, fontWeight: "700", color: "#333" },
  donutCenterSub: { fontSize: 12, color: "#999", fontWeight: "600", letterSpacing: 1 },

  legendGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  legendCard: {
    width: (SCREEN_WIDTH - 76) / 2,
    backgroundColor: "#FAFAFA",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 4,
  },
  legendIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  legendName: { fontSize: 13, fontWeight: "600", color: "#555" },
  legendPct: { fontSize: 18, fontWeight: "800", color: "#222" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#222",
    marginBottom: 12,
    marginTop: 4,
  },

  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 6,
    gap: 10,
  },
  dayDate: { fontSize: 14, fontWeight: "700", color: "#555", width: 28 },
  dayBars: {
    flex: 1,
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  dayBarSegment: { height: "100%" },
  dayAvg: { fontSize: 13, fontWeight: "700", color: "#333", width: 36, textAlign: "right" },
});
