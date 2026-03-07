import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
  useWindowDimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, G } from "react-native-svg";
import { useFocusEffect } from "expo-router";
import { useGoal } from "../../src/features/goal/goal.context";

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
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  // ── Animations ──
  const textFade = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(20)).current;
  const cloudDrift = useRef(new Animated.Value(0)).current;
  const tree1Sway = useRef(new Animated.Value(0)).current;
  const tree2Sway = useRef(new Animated.Value(0)).current;
  const hillScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Text fade + slide in
    Animated.parallel([
      Animated.timing(textFade, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(textSlide, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Hills gently scale in
    Animated.spring(hillScale, {
      toValue: 1,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Cloud drifting loop - seamless infinite scrolling
    Animated.loop(
      Animated.timing(cloudDrift, {
        toValue: 1, // Represents 1 full cycle
        duration: 35000, // Very slow and peaceful
        easing: Easing.linear, // Linear easing for constant speed
        useNativeDriver: true,
      }),
    ).start();

    // Tree sway loops
    Animated.loop(
      Animated.sequence([
        Animated.timing(tree1Sway, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(tree1Sway, {
          toValue: -1,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(tree1Sway, {
          toValue: 0,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(tree2Sway, {
          toValue: -1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(tree2Sway, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(tree2Sway, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const tree1Rotate = tree1Sway.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-3deg", "0deg", "3deg"],
  });
  const tree2Rotate = tree2Sway.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-4deg", "0deg", "4deg"],
  });

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

  // ── Calendar state ──
  const now = new Date();
  const [currentMonthDate, setCurrentMonthDate] = useState(now);
  const currentMonth = currentMonthDate.toLocaleString("default", { month: "long", year: "numeric" });
  const [selectedDate, setSelectedDate] = useState<number | null>(now.getDate());
  const photoDates: number[] = []; // placeholder — wire up to real data later

  const daysInMonth = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const count = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [currentMonthDate]);

  const firstDayOffset = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    return new Date(year, month, 1).getDay();
  }, [currentMonthDate]);

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
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={[styles.pageWrapper, isWide && styles.pageWrapperWide]}>
      {/* ===== Animated Scenic Header ===== */}
      <View style={styles.headerBg}>
        {/* Sky */}
        <View style={styles.skyLayer} />
        {/* Sun */}
        <Animated.View
          style={[
            styles.sun,
            {
              transform: [
                { translateY: cloudDrift.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -10, 0] }) },
                { scale: hillScale.interpolate({ inputRange: [0.95, 1], outputRange: [0.8, 1] }) }
              ]
            }
          ]}
        />
        {/* Drifting clouds */}
        <Animated.View
          style={[
            styles.cloudLayer,
            { transform: [{ translateX: cloudDrift.interpolate({ inputRange: [0, 1], outputRange: [width, -200] }) }] },
          ]}
        />
        <Animated.View
          style={[
            styles.cloudLayer2,
            { transform: [{ translateX: cloudDrift.interpolate({ inputRange: [0, 1], outputRange: [-150, width + 50] }) }] },
          ]}
        />
        <Animated.View
          style={[
            styles.cloudLayer3,
            { transform: [{ translateX: cloudDrift.interpolate({ inputRange: [0, 1], outputRange: [width / 2, -width] }) }] },
          ]}
        />
        {/* Hills with gentle scale */}
        <Animated.View
          style={[
            styles.hillBack,
            { transform: [{ scaleX: hillScale }, { translateY: hillScale.interpolate({ inputRange: [0.95, 1], outputRange: [10, 0] }) }] },
          ]}
        />
        <Animated.View
          style={[
            styles.hillFront,
            { transform: [{ translateY: hillScale.interpolate({ inputRange: [0.95, 1], outputRange: [15, 0] }) }] },
          ]}
        />
        {/* Trees with sway and scale */}
        <Animated.View
          style={[
            styles.tree,
            { left: "15%", bottom: 55 },
            { transform: [
                { rotate: tree1Rotate },
                { scale: hillScale.interpolate({ inputRange: [0.95, 1], outputRange: [0, 1] }) }
              ] 
            },
          ]}
        >
          <View style={[styles.treeTop, { backgroundColor: "#81C784" }]} />
          <View style={styles.treeTrunk} />
        </Animated.View>
        <Animated.View
          style={[
            styles.tree,
            { left: "30%", bottom: 65 },
            { transform: [
                { rotate: tree2Rotate },
                { scale: hillScale.interpolate({ inputRange: [0.95, 1], outputRange: [0, 1] }) }
              ] 
            },
          ]}
        >
          <View style={[styles.treeTop, { backgroundColor: "#66BB6A", width: 28, height: 28, borderRadius: 14 }]} />
          <View style={styles.treeTrunk} />
        </Animated.View>
        <Animated.View
          style={[
            styles.tree,
            { right: "25%", bottom: 50 },
            { transform: [
                { rotate: tree1Rotate },
                { scale: hillScale.interpolate({ inputRange: [0.95, 1], outputRange: [0, 1] }) }
              ] 
            },
          ]}
        >
          <View style={[styles.treeTop, { backgroundColor: "#A5D6A7" }]} />
          <View style={styles.treeTrunk} />
        </Animated.View>
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
        <View style={styles.card}>
          {/* Month nav */}
          <View style={styles.calendarNav}>
            <TouchableOpacity>
              <Ionicons name="chevron-back" size={22} color="#555" />
            </TouchableOpacity>
            <Text style={styles.monthText}>{currentMonth}</Text>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={22} color="#555" />
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
      <View style={[styles.twoCardRow, isWide && styles.twoCardRowWide]}>
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

      {/* ===== Win Tracker + Goal Path on wide screens ===== */}
      {isWide ? (
        <View style={[styles.twoCardRow, styles.twoCardRowWide, { marginBottom: 16 }]}>
          {/* Win Tracker */}
          <View style={[styles.card, { flex: 1 }]}>
            <View style={styles.trackerHeader}>
              <Text style={styles.sectionTitle}>Win Tracker</Text>
              <Text style={styles.monthlyLabel}>Monthly</Text>
            </View>
            <View style={styles.trackerBody}>
              <DonutChart
                data={winCategories.map((c) => ({ percentage: c.percentage, color: c.color }))}
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
          {/* Goal Path */}
          <View style={[styles.card, { flex: 1 }]}>
            <View style={styles.goalHeader}>
              <View>
                <Text style={styles.goalTitle}>Goal Path</Text>
                <Text style={styles.cardSubtitle}>MILESTONES</Text>
              </View>
              <View style={styles.completeBadge}>
                <Text style={styles.completeBadgeText}>3 / 5 Complete</Text>
              </View>
            </View>
            <View style={styles.milestonesRow}>
              {milestones.map((m, i) => (
                <View key={i} style={styles.milestoneCol}>
                  {i < milestones.length - 1 && (
                    <View style={[styles.milestoneLineRight, { backgroundColor: m.done ? m.color : "#e0e0e0" }]} />
                  )}
                  <View style={[styles.milestoneCircle, { backgroundColor: m.done ? m.color : "#fff", borderColor: m.done ? m.color : "#ccc", borderStyle: m.isEnd ? "dashed" : "solid" }]}>
                    {m.done ? (<Ionicons name="checkmark" size={20} color="#fff" />) : m.isStar ? (<Ionicons name="star-outline" size={18} color="#bbb" />) : (<View style={styles.endDot} />)}
                  </View>
                  {m.isEnd && <Text style={styles.endLabel}>END</Text>}
                </View>
              ))}
            </View>
          </View>
        </View>
      ) : null}

      {!isWide && <View style={styles.sectionPadding}>
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
      </View>}

      {!isWide && <View style={[styles.sectionPadding, { marginBottom: 100 }]}>
        <View style={styles.card}>
          <View style={styles.goalHeader}>
            <View>
              <Text style={styles.goalTitle}>Goal Plan</Text>
              <Text style={styles.cardSubtitle}>YOUR GOALS</Text>
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
      </View>}
      </View>
    </ScrollView>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#FAF7F2",
  },
  pageWrapper: {
    width: "100%",
  },
  pageWrapperWide: {
    maxWidth: 960,
    alignSelf: "center" as const,
    width: "100%",
  },

  /* ---- Header ---- */
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  headerGreeting: {
    fontSize: 15,
    fontWeight: "400",
    color: "#8A7F72",
  },
  headerName: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2E2A26",
    marginTop: 2,
  },
  headerBg: {
    width: "100%",
    height: 250,
    backgroundColor: "#dce9f5",
    overflow: "hidden",
    position: "relative",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  skyLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#E3F2FD",
  },
  sun: {
    position: "absolute",
    top: 40,
    right: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF9C4",
    shadowColor: "#FFF59D",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 5,
  },
  cloudLayer: {
    position: "absolute",
    top: 20,
    right: -20,
    width: 140,
    height: 60,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 30,
  },
  cloudLayer2: {
    position: "absolute",
    top: 50,
    left: 10,
    width: 100,
    height: 45,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 30,
  },
  cloudLayer3: {
    position: "absolute",
    top: 15,
    left: "30%",
    width: 80,
    height: 35,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 20,
  },
  hillBack: {
    position: "absolute",
    bottom: 0,
    left: "-10%",
    width: "120%",
    height: 110,
    backgroundColor: "#C8E6C9",
    borderTopLeftRadius: 250,
    borderTopRightRadius: 250,
  },
  hillFront: {
    position: "absolute",
    bottom: 0,
    left: "-5%",
    width: "110%",
    height: 70,
    backgroundColor: "#A5D6A7",
    borderTopLeftRadius: 350,
    borderTopRightRadius: 150,
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
  calendarSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
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

  /* ---- Two-card row ---- */
  twoCardRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  twoCardRowWide: {
    gap: 20,
    paddingHorizontal: 24,
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
    fontWeight: "700",
    color: "#111827",
  },
  goalRowSub: {
    marginTop: 4,
    fontSize: 12,
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

  /* ---- Milestones ---- */
  completeBadge: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  completeBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#66BB6A",
  },
  milestonesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
  },
  milestoneCol: {
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  milestoneLineRight: {
    position: "absolute",
    top: 18,
    left: "50%",
    right: "-50%",
    height: 3,
    borderRadius: 2,
  },
  milestoneCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  endDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
  },
  endLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#aaa",
    marginTop: 4,
    letterSpacing: 1,
  },
});
