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
import { CalendarContainer } from "../../src/features/calendar";

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

  const dailyWins: DailyWin[] = [
    { id: "1", emoji: "😊", title: "Gratitude", bgColor: "#FFF3E0" },
    { id: "2", emoji: "🧘", title: "Morning ex...", bgColor: "#F3E5F5" },
    { id: "3", emoji: "📚", title: "Read book", bgColor: "#E3F2FD" },
  ];

  const winCategories: WinCategory[] = [
    { name: "Mental", percentage: 35, color: "#FF8A80" },
    { name: "Physical", percentage: 25, color: "#82B1FF" },
    { name: "Spiritual", percentage: 20, color: "#B9F6CA" },
    { name: "Goal Path", percentage: 20, color: "#FFE0B2" },
  ];

  const milestones = [
    { done: true, color: "#81C784" },
    { done: true, color: "#64B5F6" },
    { done: true, color: "#FF8A65" },
    { done: false, isStar: true, color: "#E0E0E0" },
    { done: false, isEnd: true, color: "#E0E0E0" },
  ];

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
          <View style={[styles.treeTop, { backgroundColor: "#81C784" }]} />
          <View style={styles.treeTrunk} />
        </View>
        <View style={[styles.tree, { left: 80, bottom: 65 }]}>
          <View style={[styles.treeTop, { backgroundColor: "#66BB6A", width: 28, height: 28, borderRadius: 14 }]} />
          <View style={styles.treeTrunk} />
        </View>
        <View style={[styles.tree, { right: 70, bottom: 50 }]}>
          <View style={[styles.treeTop, { backgroundColor: "#A5D6A7" }]} />
          <View style={styles.treeTrunk} />
        </View>
        <View style={[styles.tree, { right: 40, bottom: 40 }]}>
          <View style={[styles.treeTop, { backgroundColor: "#FF8A65", width: 30, height: 30, borderRadius: 15 }]} />
          <View style={styles.treeTrunk} />
        </View>
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
          />
        </View>
      </View>

      {/* ===== Calendar ===== */}
      <View style={styles.sectionPadding}>
        <CalendarContainer />
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
              <Ionicons name="image-outline" size={40} color="#ccc" />
            </View>
            <View style={styles.momentCaptionWrap}>
              <Ionicons name="camera-outline" size={12} color="#fff" />
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
              <Text style={styles.goalTitle}>Goal Path</Text>
              <Text style={styles.cardSubtitle}>MILESTONES</Text>
            </View>
            <View style={styles.completeBadge}>
              <Text style={styles.completeBadgeText}>3 / 5 Complete</Text>
            </View>
          </View>

          {/* Milestones */}
          <View style={styles.milestonesRow}>
            {milestones.map((m, i) => (
              <View key={i} style={styles.milestoneCol}>
                {/* Connecting line to the right */}
                {i < milestones.length - 1 && (
                  <View
                    style={[
                      styles.milestoneLineRight,
                      { backgroundColor: m.done ? m.color : "#e0e0e0" },
                    ]}
                  />
                )}
                <View
                  style={[
                    styles.milestoneCircle,
                    {
                      backgroundColor: m.done ? m.color : "#fff",
                      borderColor: m.done ? m.color : "#ccc",
                      borderStyle: m.isEnd ? "dashed" : "solid",
                    },
                  ]}
                >
                  {m.done ? (
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  ) : m.isStar ? (
                    <Ionicons name="star-outline" size={18} color="#bbb" />
                  ) : (
                    <View style={styles.endDot} />
                  )}
                </View>
                {m.isEnd && <Text style={styles.endLabel}>END</Text>}
              </View>
            ))}
          </View>
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
    backgroundColor: "#f7f7f7",
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
    fontWeight: "300",
    color: "#333",
  },
  headerSub: {
    fontSize: 20,
    fontWeight: "300",
    color: "#666",
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
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },

  /* ---- Shared ---- */
  sectionPadding: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  cardSubtitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#aaa",
    letterSpacing: 1,
    marginTop: 2,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
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
    width: "80%" as any,
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
    fontWeight: "700",
    color: "#64B5F6",
  },
  completeBadge: {
    borderWidth: 1,
    borderColor: "#c8e6c9",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  completeBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#66BB6A",
  },
  milestonesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  milestoneCol: {
    alignItems: "center",
    position: "relative",
  },
  milestoneCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  milestoneLineRight: {
    position: "absolute",
    top: 22,
    left: 46,
    width: 30,
    height: 3,
    borderRadius: 2,
    zIndex: -1,
  },
  endDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
  },
  endLabel: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: "600",
    color: "#bbb",
    letterSpacing: 1,
  },
});
