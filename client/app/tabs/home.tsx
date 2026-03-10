import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import Svg, { Circle, G } from "react-native-svg";
import { colors } from "../../src/constants/colors";

import { useGoal } from "../../src/features/goal/goal.context"; // adjust path
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo } from "react";

// ---------- Types ----------
interface DailyWin {
  id: string;
  emoji: string;
  title: string;
  bgColor: string;
}

interface WinCategory {
  name: string;
  percentage: number;
  color: string;
}

// ---------- Donut Chart Component ----------
function DonutChart({
  data,
  size = 140,
  strokeWidth = 18,
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
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#f0f0f0"
          strokeWidth={strokeWidth}
          fill="none"
        />
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
export default function HomeScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(15);
  const currentMonth = "December 2024";

  const dailyWins: DailyWin[] = [
    { id: "1", emoji: "😊", title: "Gratitude", bgColor: colors.cardAlt },
    { id: "2", emoji: "🧘", title: "Morning ex...", bgColor: colors.softBeige },
    { id: "3", emoji: "📚", title: "Read book", bgColor: colors.warmTan },
  ];

  const winCategories: WinCategory[] = [
    { name: "Mental", percentage: 35, color: colors.wood.dark },
    { name: "Physical", percentage: 25, color: colors.wood.medium },
    { name: "Spiritual", percentage: 20, color: colors.wood.light },
    { name: "Goal Path", percentage: 20, color: colors.warmTan },
  ];

  // December 2024 starts on Sunday → offset = 0
  const firstDayOffset = 0;
  const totalDays = 31;
  const daysInMonth = Array.from({ length: totalDays }, (_, i) => i + 1);

  // Dates that have photo-circle markers
  const photoDates = [5, 8, 12, 20];

  const milestones = [
    { done: true, color: colors.wood.dark },
    { done: true, color: colors.wood.medium },
    { done: true, color: colors.warmTan },
    { done: false, isStar: true, color: colors.borderLight },
    { done: false, isEnd: true, color: colors.borderLight },
  ];

  //fetch goals whenever Home is opened (keeps up to date)
  const { goals, fetchGoals } = useGoal();
  useFocusEffect(
    useCallback(() => {
      fetchGoals();
    }, [fetchGoals])
  );

  const displayGoals = useMemo(() => (goals ?? []).slice(0, 5), [goals]);

  const allGoalsCompleted = useMemo(() => {
  if (!goals || goals.length === 0) return false;
  return goals.every((g) => g.stages?.length > 0 && g.stages.every((s) => s.completed));
  }, [goals]);

  const getGoalRowBg = (completed: number, total: number) => {
  if (!total || total <= 0) return colors.background; // No progress
  if (completed <= 0) return colors.background;

  // Convert any total into a 1..6 bucket
  const ratio = completed / total;
  const bucket = Math.min(6, Math.max(1, Math.ceil(ratio * 6))); // 1..6

  // Wood-themed background colors that get warmer with progress
  switch (bucket) {
    case 1:
      return colors.background; // Cream
    case 2:
      return `${colors.cardAlt}CC`; // Soft beige with opacity
    case 3:
      return colors.cardAlt; // Soft beige
    case 4:
      return `${colors.warmTan}80`; // Warm tan light
    case 5:
      return `${colors.warmTan}B3`; // Warm tan medium
    case 6:
      return `${colors.warmTan}E6`; // Warm tan full (near complete)
    default:
      return colors.background;
  }
};

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* ===== Scenic Header ===== */}
      <View style={styles.headerBg}>
        {/* Sky */}
        <View style={styles.skyLayer} />
        <View style={styles.cloudLayer} />
        {/* Hills */}
        <View style={styles.hillBack} />
        <View style={styles.hillFront} />
        {/* Trees */}
        <View style={[styles.tree, { left: 40, bottom: 55 }]}>
          <View style={[styles.treeTop, { backgroundColor: colors.wood.medium }]} />
          <View style={styles.treeTrunk} />
        </View>
        <View style={[styles.tree, { left: 80, bottom: 65 }]}>
          <View style={[styles.treeTop, { backgroundColor: colors.wood.dark, width: 28, height: 28, borderRadius: 14 }]} />
          <View style={styles.treeTrunk} />
        </View>
        <View style={[styles.tree, { right: 70, bottom: 50 }]}>
          <View style={[styles.treeTop, { backgroundColor: colors.wood.light }]} />
          <View style={styles.treeTrunk} />
        </View>
        <View style={[styles.tree, { right: 40, bottom: 40 }]}>
          <View style={[styles.treeTop, { backgroundColor: colors.warmTan, width: 30, height: 30, borderRadius: 15 }]} />
          <View style={styles.treeTrunk} />
        </View>
        {/* Profile Icon - Top Right */}
        <TouchableOpacity
          style={styles.profileIconButton}
          onPress={() => router.push("/other/profile")}
        >
          <View style={styles.profileIconContainer}>
            <Ionicons name="person" size={24} color={colors.text.secondary} />
          </View>
        </TouchableOpacity>
        {/* Header Text */}
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerHello}>Hello,</Text>
          <Text style={styles.headerSub}>Nice to Meet You</Text>
        </View>
      </View>

      {/* ===== Search Bar ===== */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={colors.text.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your moments..."
            placeholderTextColor={colors.text.muted}
          />
        </View>
      </View>

      {/* ===== Calendar ===== */}
      <View style={styles.sectionPadding}>
        <View style={styles.card}>
          {/* Month nav */}
          <View style={styles.calendarNav}>
            <TouchableOpacity>
              <Ionicons name="chevron-back" size={22} color={colors.text.secondary} />
            </TouchableOpacity>
            <Text style={styles.monthText}>{currentMonth}</Text>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={22} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Day headers */}
          <View style={styles.dayHeaderRow}>
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <Text key={d} style={styles.dayHeader}>{d}</Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View style={styles.calGrid}>
            {/* Offset empty cells */}
            {Array.from({ length: firstDayOffset }).map((_, i) => (
              <View key={`e${i}`} style={styles.calCell} />
            ))}
            {daysInMonth.map((day) => {
              const isSelected = selectedDate === day;
              const hasPhoto = photoDates.includes(day);
              return (
                <TouchableOpacity
                  key={day}
                  style={styles.calCell}
                  onPress={() => setSelectedDate(day)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.calDayCircle,
                      isSelected && styles.calDaySelected,
                      hasPhoto && !isSelected && styles.calDayPhoto,
                    ]}
                  >
                    <Text
                      style={[
                        styles.calDayText,
                        isSelected && styles.calDayTextSelected,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* ===== Life Moments & Daily Wins ===== */}
      <View style={styles.twoCardRow}>
        {/* Life Moments */}
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardTitle}>Life Moments</Text>
          <Text style={styles.cardSubtitle}>RECENTLY</Text>
          {/* Photo placeholder */}
          <View style={styles.momentImageWrap}>
            <View style={styles.momentImagePlaceholder}>
              <Ionicons name="image-outline" size={40} color={colors.borderLight} />
            </View>
            <View style={styles.momentCaptionWrap}>
              <Ionicons name="camera-outline" size={12} color={colors.text.light} />
              <Text style={styles.momentCaption}>Morning light</Text>
            </View>
          </View>
          <View style={styles.momentFooter}>
            <View style={styles.momentThumbs}>
              <View style={styles.thumbCircle} />
              <View style={[styles.thumbCircle, { marginLeft: -8 }]} />
              <View style={[styles.thumbCircle, { marginLeft: -8 }]} />
            </View>
            <Text style={styles.moreText}>+12 more</Text>
          </View>
        </View>

        {/* Daily Wins */}
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardTitle}>Daily Wins</Text>
          <Text style={styles.cardSubtitle}>TODAY</Text>
          {dailyWins.map((win) => (
            <View
              key={win.id}
              style={[styles.winChip, { backgroundColor: win.bgColor }]}
            >
              <Text style={styles.winChipEmoji}>{win.emoji}</Text>
              <Text style={styles.winChipText}>{win.title}</Text>
            </View>
          ))}
          {/* Progress bar */}
          <View style={styles.doneRow}>
            <View style={styles.doneDot} />
            <Text style={styles.doneText}>80% DONE</Text>
            <View style={styles.doneBarBg}>
              <View style={styles.doneBarFill} />
            </View>
          </View>
        </View>
      </View>

      {/* ===== Win Tracker ===== */}
      <View style={styles.sectionPadding}>
        <View style={styles.card}>
          <View style={styles.trackerHeader}>
            <Text style={styles.sectionTitle}>Win Tracker</Text>
            <Text style={styles.monthlyLabel}>Monthly</Text>
          </View>
          <View style={styles.trackerBody}>
            <DonutChart
              data={winCategories.map((c) => ({
                percentage: c.percentage,
                color: c.color,
              }))}
              centerLabel="82%"
              centerSub="TOTAL"
            />
            <View style={styles.legendList}>
              {winCategories.map((cat) => (
                <View key={cat.name} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
                  <Text style={styles.legendName}>{cat.name}</Text>
                  <Text style={styles.legendPct}>{cat.percentage}%</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* ===== Goal Path ===== */}
      <View style={[styles.sectionPadding, { marginBottom: 100 }]}>
        <View style={styles.card}>
          <View style={styles.goalHeader}>
            <View>
              <Text style={styles.goalTitle}>Goal Plan</Text>
              <Text style={styles.cardSubtitle}>YOUR GOALS</Text>
            </View>
          </View>

          {/* no goals */}
          {(!goals || goals.length === 0) && (
            <Text style={styles.goalEmptyText}>No goal plans</Text>
          )}

          {/* all completed */}
          {goals && goals.length > 0 && allGoalsCompleted && (
            <Text style={styles.goalEmptyText}>All Goals completed - create a new Goal</Text>
          )}

          {/* list (max 5) */}
          {goals && goals.length > 0 && !allGoalsCompleted && (
            <View style={{ gap: 10 }}>
              {displayGoals.map((g) => {
                const total = g.stages?.length ?? 0;
                const completed = g.stages?.filter((s) => s.completed).length ?? 0;
                const remaining = Math.max(0, total - completed);

                const isCompleted = total > 0 && completed === total;

                return (
                  <TouchableOpacity
                    key={g.id}
                    style={[
                      styles.goalRow,
                      { backgroundColor: getGoalRowBg(completed, total) },
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                      router.push({
                        pathname: "/tabs/goal/roadmap",
                        params: { goalId: g.id },
                      });
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.goalRowTitle} numberOfLines={1}>
                        {g.title}
                      </Text>
                      <Text style={styles.goalRowSub}>
                        {isCompleted ? "Completed" : "In progress"}
                        {total > 0 ? `  •  ${remaining}/${total}` : ""}
                      </Text>
                    </View>

                    <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

// ---------- Styles ----------
const { width: SCREEN_W } = Dimensions.get("window");

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* ---- Header ---- */
  headerBg: {
    width: "100%",
    height: 220,
    backgroundColor: colors.cardAlt,
    overflow: "hidden",
    position: "relative",
  },
  skyLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.softBeige,
  },
  cloudLayer: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 180,
    height: 100,
    backgroundColor: colors.warmTan,
    borderBottomLeftRadius: 100,
    opacity: 0.4,
  },
  hillBack: {
    position: "absolute",
    bottom: 0,
    left: -30,
    width: SCREEN_W + 60,
    height: 100,
    backgroundColor: colors.wood.lightest,
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
  },
  hillFront: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: SCREEN_W,
    height: 60,
    backgroundColor: colors.warmTan,
    borderTopLeftRadius: 300,
    borderTopRightRadius: 100,
  },
  tree: {
    position: "absolute",
    alignItems: "center",
  },
  treeTop: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  treeTrunk: {
    width: 4,
    height: 14,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  headerTextWrap: {
    position: "absolute",
    top: 60,
    width: "100%",
    alignItems: "center",
  },
  headerHello: {
    fontSize: 32,
    fontWeight: "300",
    color: colors.text.primary,
  },
  headerSub: {
    fontSize: 20,
    fontWeight: "300",
    color: colors.text.secondary,
    marginTop: 2,
  },

  /* ---- Search ---- */
  searchWrapper: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
  },

  /* ---- Shared ---- */
  sectionPadding: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
  },
  cardSubtitle: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.text.muted,
    letterSpacing: 1,
    marginTop: 2,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
  },

  /* ---- Calendar ---- */
  calendarNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthText: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.text.primary,
  },
  dayHeaderRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  dayHeader: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    color: colors.text.muted,
    letterSpacing: 0.5,
  },
  calGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calCell: {
    width: `${100 / 7}%` as any,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  calDayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  calDaySelected: {
    backgroundColor: colors.primary,
  },
  calDayPhoto: {
    backgroundColor: colors.cardAlt,
  },
  calDayText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.primary,
  },
  calDayTextSelected: {
    color: colors.text.light,
    fontWeight: "700",
  },

  /* ---- Two-card row ---- */
  twoCardRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  halfCard: {
    flex: 1,
  },

  /* ---- Life Moments ---- */
  momentImageWrap: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    position: "relative",
  },
  momentImagePlaceholder: {
    width: "100%",
    height: 130,
    backgroundColor: colors.cardAlt,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  momentCaptionWrap: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.overlay,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  momentCaption: {
    fontSize: 11,
    color: colors.text.light,
    fontWeight: "600",
  },
  momentFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  momentThumbs: {
    flexDirection: "row",
  },
  thumbCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.borderLight,
    borderWidth: 2,
    borderColor: colors.card,
  },
  moreText: {
    fontSize: 11,
    color: colors.text.muted,
  },

  /* ---- Daily Wins ---- */
  winChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    gap: 8,
  },
  winChipEmoji: {
    fontSize: 20,
  },
  winChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
  },
  doneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 6,
  },
  doneDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  doneText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.text.secondary,
  },
  doneBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    overflow: "hidden",
  },
  doneBarFill: {
    width: "80%" as any,
    height: "100%",
    backgroundColor: colors.accent,
    borderRadius: 3,
  },

  /* ---- Win Tracker ---- */
  trackerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthlyLabel: {
    fontSize: 14,
    color: colors.text.muted,
    fontWeight: "500",
  },
  trackerBody: {
    flexDirection: "row",
    alignItems: "center",
  },
  donutCenter: {
    position: "absolute",
    alignItems: "center",
  },
  donutCenterLabel: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text.primary,
  },
  donutCenterSub: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.text.muted,
    letterSpacing: 1,
  },
  legendList: {
    flex: 1,
    marginLeft: 20,
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: colors.text.secondary,
  },
  legendPct: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
  },

  /* ---- Goal Path ---- */
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
  },
  goalEmptyText: {
    fontSize: 14,
    color: colors.text.muted,
    marginTop: 6,
  },
  goalRow: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.card,
  },
  goalRowTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
  },
  goalRowSub: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.muted,
  },

  /* ---- Profile Icon ---- */
  profileIconButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  profileIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
});
