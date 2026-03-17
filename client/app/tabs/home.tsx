import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, G } from "react-native-svg";

import { useGoal } from "../../src/features/goal/goal.context"; // adjust path
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { useAuth } from "../../src/hooks/useAuth";
import { getCalendar } from "../../src/services/habit.service";
import type { CalendarData } from "../../src/features/habit/habit.types";
import JournalCalendar from "../../src/components/home/calender/JournalCalendar";
import JournalPreviewBottomSheet from "../../src/components/home/calender/JournalPreviewBottomSheet";
import JournalViewerModal from "../../src/components/home/calender/JournalViewerModal";
import JournalSearchResults from "../../src/components/home/calender/JournalSearchResults";
import { getAllJournals } from "../../src/features/journal/journal.api";
import type { JournalEntryWithBlocks } from "../../src/features/journal/journal.types";
import type { ImageBlock } from "../../types/journal";

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
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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
  const { user } = useAuth();
  const [sheetDate, setSheetDate] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] =
    useState<JournalEntryWithBlocks | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [allJournals, setAllJournals] = useState<JournalEntryWithBlocks[]>([]);
  const [habitCalendar, setHabitCalendar] = useState<CalendarData>({});

  const milestones = [
    { done: true, color: "#81C784" },
    { done: true, color: "#64B5F6" },
    { done: true, color: "#FF8A65" },
    { done: false, isStar: true, color: "#E0E0E0" },
    { done: false, isEnd: true, color: "#E0E0E0" },
  ];

  //fetch goals whenever Home is opened (keeps up to date)
  const { goals, fetchGoals } = useGoal();
  useFocusEffect(
    useCallback(() => {
      fetchGoals();
      // Fetch habit calendar + journal entries on focus
      if (user) {
        getCalendar()
          .then(setHabitCalendar)
          .catch(() => {});
        getAllJournals()
          .then(setAllJournals)
          .catch(() => {});
      }
    }, [fetchGoals, user]),
  );

  const displayGoals = useMemo(() => (goals ?? []).slice(0, 5), [goals]);

  // ---- Compute Life Moments from journal entries ----
  const lifeMoments = useMemo(() => {
    // Get pinned entries or entries with images, sorted by most recently updated
    const withImages = allJournals
      .map((j) => {
        const img = j.blocks.find((b): b is ImageBlock => b.type === "image");
        return { journal: j, image: img ?? null };
      })
      .filter((m) => m.journal.isPinnedToTimeline || m.image)
      .sort((a, b) => b.journal.updatedAt - a.journal.updatedAt);
    return withImages;
  }, [allJournals]);

  const latestMoment = lifeMoments[0] ?? null;
  const momentCount = lifeMoments.length;

  // ---- Compute Daily Wins from today's habit scores ----
  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  const dailyWins = useMemo<DailyWin[]>(() => {
    const today = habitCalendar[todayStr];
    if (!today) return [];
    const mapping: { key: keyof typeof today; emoji: string; title: string; bgColor: string }[] = [
      { key: "spiritual", emoji: "🧘", title: "Spiritual", bgColor: "#E8F5E9" },
      { key: "mental", emoji: "🧠", title: "Mental", bgColor: "#F3E5F5" },
      { key: "physical", emoji: "💪", title: "Physical", bgColor: "#E3F2FD" },
    ];
    return mapping
      .filter((m) => (today[m.key] ?? 0) >= 0.5)
      .map((m, i) => ({ id: String(i), emoji: m.emoji, title: `${m.title}${today[m.key] === 1 ? " ✓" : " ~"}`, bgColor: m.bgColor }));
  }, [habitCalendar, todayStr]);

  const dailyWinPct = useMemo(() => {
    const today = habitCalendar[todayStr];
    if (!today) return 0;
    const filled = ["spiritual", "mental", "physical"].filter((k) => (today[k as keyof typeof today] ?? 0) > 0).length;
    return Math.round((filled / 3) * 100);
  }, [habitCalendar, todayStr]);

  // ---- Compute Win Tracker categories from monthly habit data + goals ----
  const winCategories = useMemo<WinCategory[]>(() => {
    const now = new Date();
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const monthDays = Object.entries(habitCalendar).filter(([d]) => d.startsWith(prefix));
    const dayCount = Math.max(monthDays.length, 1);

    const catScore = (cat: "spiritual" | "mental" | "physical") => {
      const total = monthDays.reduce((s, [, scores]) => s + (scores?.[cat] ?? 0), 0);
      return Math.round((total / dayCount) * 100);
    };

    const mentalPct = catScore("mental");
    const physicalPct = catScore("physical");
    const spiritualPct = catScore("spiritual");

    // Goal path: percentage of completed stages across all goals
    const allStages = (goals ?? []).flatMap((g) => g.stages ?? []);
    const goalPct = allStages.length > 0
      ? Math.round((allStages.filter((s) => s.completed).length / allStages.length) * 100)
      : 0;

    return [
      { name: "Mental", percentage: mentalPct, color: "#FF8A80" },
      { name: "Physical", percentage: physicalPct, color: "#82B1FF" },
      { name: "Spiritual", percentage: spiritualPct, color: "#B9F6CA" },
      { name: "Goal Path", percentage: goalPct, color: "#FFE0B2" },
    ];
  }, [habitCalendar, goals]);

  const totalWinPct = useMemo(() => {
    const sum = winCategories.reduce((s, c) => s + c.percentage, 0);
    return Math.round(sum / Math.max(winCategories.length, 1));
  }, [winCategories]);

  const allGoalsCompleted = useMemo(() => {
    if (!goals || goals.length === 0) return false;
    return goals.every(
      (g) => g.stages?.length > 0 && g.stages.every((s) => s.completed),
    );
  }, [goals]);

  const getGoalRowBg = (completed: number, total: number) => {
    if (!total || total <= 0) return "#F3F4F6"; // gray
    if (completed <= 0) return "#F3F4F6";

    // Convert any total into a 1..6 bucket
    const ratio = completed / total;
    const bucket = Math.min(6, Math.max(1, Math.ceil(ratio * 6))); // 1..6

    // setting background colors for the goals based on the progress
    switch (bucket) {
      case 1:
        return "#DCFCE7";
      case 2:
        return "#DBEAFE";
      case 3:
        return "#EDE9FE";
      case 4:
        return "#FEF3C7";
      case 5:
        return "#FFE4E6";
      case 6:
        return "#D1FAE5";
      default:
        return "#F3F4F6";
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
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
          <View style={[styles.treeTop, { backgroundColor: "#81C784" }]} />
          <View style={styles.treeTrunk} />
        </View>
        <View style={[styles.tree, { left: 80, bottom: 65 }]}>
          <View
            style={[
              styles.treeTop,
              {
                backgroundColor: "#66BB6A",
                width: 28,
                height: 28,
                borderRadius: 14,
              },
            ]}
          />
          <View style={styles.treeTrunk} />
        </View>
        <View style={[styles.tree, { right: 70, bottom: 50 }]}>
          <View style={[styles.treeTop, { backgroundColor: "#A5D6A7" }]} />
          <View style={styles.treeTrunk} />
        </View>
        <View style={[styles.tree, { right: 40, bottom: 40 }]}>
          <View
            style={[
              styles.treeTop,
              {
                backgroundColor: "#FF8A65",
                width: 30,
                height: 30,
                borderRadius: 15,
              },
            ]}
          />
          <View style={styles.treeTrunk} />
        </View>
        {/* Profile Icon - Top Right */}
        <TouchableOpacity
          style={styles.profileIconButton}
          onPress={() => router.push("/other/profile")}
        >
          <View style={styles.profileIconContainer}>
            <Ionicons name="person" size={24} color="#333" />
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
          <Ionicons name="search-outline" size={20} color="#bbb" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your moments..."
            placeholderTextColor="#bbb"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={18} color="#bbb" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ===== Journal Search Results ===== */}
      {/* Appears between the search bar and calendar; pushes calendar down */}
      <JournalSearchResults
        query={searchQuery}
        journals={allJournals}
        onSelect={(entry) => {
          setSearchQuery("");
          setSelectedEntry(entry);
        }}
      />

      {/* ===== Journal Calendar ===== */}
      {user && (
        <View style={styles.sectionPadding}>
          <JournalCalendar
            userId={user.userId}
            onMarkedDatePress={(date) => setSheetDate(date)}
          />
        </View>
      )}

      {/* ===== Journal Preview Bottom Sheet ===== */}
      {user && sheetDate && (
        <JournalPreviewBottomSheet
          visible={sheetDate !== null}
          date={sheetDate}
          onClose={() => setSheetDate(null)}
          onSelectEntry={(entry: JournalEntryWithBlocks) => {
            setSelectedEntry(entry);
            // Bottom sheet animates out and calls setSheetDate(null) via onClose
          }}
        />
      )}

      {/* ===== Journal Viewer Modal ===== */}
      <JournalViewerModal
        visible={selectedEntry !== null}
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />

      {/* ===== Life Moments & Daily Wins ===== */}
      <View style={styles.twoCardRow}>
        {/* Life Moments */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.card, styles.halfCard]}
          onPress={() => {
            if (latestMoment) setSelectedEntry(latestMoment.journal);
          }}
        >
          <Text style={styles.cardTitle}>Life Moments</Text>
          <Text style={styles.cardSubtitle}>RECENTLY</Text>
          {latestMoment ? (
            <>
              <View style={styles.momentImageWrap}>
                {latestMoment.image ? (
                  <Image
                    source={{ uri: latestMoment.image.imageUri }}
                    style={styles.momentImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.momentImagePlaceholder}>
                    <Ionicons name="document-text-outline" size={40} color="#ccc" />
                  </View>
                )}
                <View style={styles.momentCaptionWrap}>
                  <Ionicons name={latestMoment.image ? "camera-outline" : "bookmark-outline"} size={12} color="#fff" />
                  <Text style={styles.momentCaption} numberOfLines={1}>
                    {latestMoment.journal.title || latestMoment.journal.date}
                  </Text>
                </View>
              </View>
              <View style={styles.momentFooter}>
                {lifeMoments.slice(1, 4).map((m, i) => (
                  <TouchableOpacity
                    key={m.journal.id}
                    activeOpacity={0.7}
                    onPress={() => setSelectedEntry(m.journal)}
                    style={[
                      styles.thumbCircle,
                      i > 0 && { marginLeft: -8 },
                      m.image ? undefined : { backgroundColor: "#D1C4E9" },
                    ]}
                  >
                    {m.image && (
                      <Image
                        source={{ uri: m.image.imageUri }}
                        style={{ width: 22, height: 22, borderRadius: 11 }}
                      />
                    )}
                  </TouchableOpacity>
                ))}
                {momentCount > 1 && (
                  <Text style={styles.moreText}>+{momentCount - 1} more</Text>
                )}
              </View>
            </>
          ) : (
            <View style={styles.momentImageWrap}>
              <View style={styles.momentImagePlaceholder}>
                <Ionicons name="image-outline" size={40} color="#ccc" />
              </View>
              <Text style={{ fontSize: 12, color: "#aaa", marginTop: 8 }}>No moments yet</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Daily Wins */}
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardTitle}>Daily Wins</Text>
          <Text style={styles.cardSubtitle}>TODAY</Text>
          {dailyWins.length === 0 && (
            <Text style={{ fontSize: 12, color: "#aaa", marginTop: 8 }}>No wins yet today</Text>
          )}
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
            <Text style={styles.doneText}>{dailyWinPct}% DONE</Text>
            <View style={styles.doneBarBg}>
              <View style={[styles.doneBarFill, { width: `${dailyWinPct}%` as any }]} />
            </View>
          </View>
        </View>
      </View>

      {/* ===== Win Tracker ===== */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push("/other-tabs/win-tracker")}
        style={styles.sectionPadding}
      >
        <View style={styles.card}>
          <View style={styles.trackerHeader}>
            <Text style={styles.sectionTitle}>Win Tracker</Text>
            <Ionicons name="chevron-forward" size={18} color="#aaa" />
          </View>
          <View style={styles.trackerBody}>
            <DonutChart
              data={winCategories.map((c) => ({
                percentage: c.percentage,
                color: c.color,
              }))}
              centerLabel={`${totalWinPct}%`}
              centerSub="TOTAL"
            />
            <View style={styles.legendList}>
              {winCategories.map((cat) => (
                <View key={cat.name} style={styles.legendItem}>
                  <View
                    style={[styles.legendDot, { backgroundColor: cat.color }]}
                  />
                  <Text style={styles.legendName}>{cat.name}</Text>
                  <Text style={styles.legendPct}>{cat.percentage}%</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>

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
            <Text style={styles.goalEmptyText}>
              All Goals completed - create a new Goal
            </Text>
          )}

          {/* list (max 5) */}
          {goals && goals.length > 0 && !allGoalsCompleted && (
            <View style={{ gap: 10 }}>
              {displayGoals.map((g) => {
                const total = g.stages?.length ?? 0;
                const completed =
                  g.stages?.filter((s) => s.completed).length ?? 0;
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

                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="#9CA3AF"
                    />
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
    backgroundColor: "#F4F6FA",
  },

  /* ---- Header ---- */
  headerBg: {
    width: "100%",
    height: 220,
    backgroundColor: "#dce9f5",
    overflow: "hidden",
    position: "relative",
  },
  skyLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#e8eef6",
  },
  cloudLayer: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 180,
    height: 100,
    backgroundColor: "#f3d4d0",
    borderBottomLeftRadius: 100,
    opacity: 0.5,
  },
  hillBack: {
    position: "absolute",
    bottom: 0,
    left: -30,
    width: SCREEN_W + 60,
    height: 100,
    backgroundColor: "#c5ddb8",
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
  },
  hillFront: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: SCREEN_W,
    height: 60,
    backgroundColor: "#d4c9a8",
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
    backgroundColor: "#8D6E63",
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
    fontFamily: "Roboto_400Regular",
    fontWeight: "300",
    color: "#333",
  },
  headerSub: {
    fontSize: 20,
    fontFamily: "Roboto_400Regular",
    fontWeight: "300",
    color: "#666",
    marginTop: 2,
  },

  /* ---- Search ---- */
  searchWrapper: {
    paddingHorizontal: 20,
    marginTop: 14,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E9EEF5",
    paddingHorizontal: 16,
    paddingVertical: 11,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Roboto_400Regular",
    color: "#333",
  },

  /* ---- Shared ---- */
  sectionPadding: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: "Roboto_500Medium",
    fontWeight: "700",
    color: "#222",
  },
  cardSubtitle: {
    fontSize: 11,
    fontFamily: "Roboto_400Regular",
    fontWeight: "600",
    color: "#aaa",
    letterSpacing: 1,
    marginTop: 2,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Roboto_500Medium",
    fontWeight: "700",
    color: "#222",
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
    color: "#333",
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
    color: "#aaa",
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
    backgroundColor: "#64B5F6",
  },
  calDayPhoto: {
    backgroundColor: "#e8e8e8",
  },
  calDayText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
  },
  calDayTextSelected: {
    color: "#fff",
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
    backgroundColor: "#f0ece4",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  momentImage: {
    width: "100%",
    height: 130,
    borderRadius: 12,
  },
  momentCaptionWrap: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  momentCaption: {
    fontSize: 11,
    color: "#fff",
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
    backgroundColor: "#ddd",
    borderWidth: 2,
    borderColor: "#fff",
  },
  moreText: {
    fontSize: 11,
    color: "#999",
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
    color: "#444",
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
    backgroundColor: "#66BB6A",
  },
  doneText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#666",
  },
  doneBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    overflow: "hidden",
  },
  doneBarFill: {
    height: "100%",
    backgroundColor: "#66BB6A",
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
    color: "#aaa",
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
    color: "#333",
  },
  donutCenterSub: {
    fontSize: 11,
    fontWeight: "600",
    color: "#aaa",
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
    color: "#555",
  },
  legendPct: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
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
    fontFamily: "Roboto_500Medium",
    fontWeight: "700",
    color: "#000000",
  },
  goalEmptyText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 6,
  },
  goalRow: {
    borderWidth: 1,
    borderColor: "#EEF2F7",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  goalRowTitle: {
    fontSize: 15,
    fontFamily: "Roboto_500Medium",
    fontWeight: "700",
    color: "#111827",
  },
  goalRowSub: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: "Roboto_400Regular",
    fontWeight: "600",
    color: "#6B7280",
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
