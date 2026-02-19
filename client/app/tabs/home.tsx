import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

interface DailyWin {
  id: string;
  emoji: string;
  title: string;
  icon?: string;
}

interface WinCategory {
  name: string;
  percentage: number;
  color: string;
  emoji: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(15);
  const currentMonth = "December 2024";

  const dailyWins: DailyWin[] = [
    { id: "1", emoji: "😊", title: "Gratitude" },
    { id: "2", emoji: "💗", title: "Morning ex..." },
    { id: "3", emoji: "📚", title: "Read book" },
  ];

  const winCategories: WinCategory[] = [
    { name: "Mental", percentage: 35, color: "#60a5fa", emoji: "🧠" },
    { name: "Physical", percentage: 40, color: "#4ade80", emoji: "💪" },
    { name: "Spiritual", percentage: 25, color: "#fb923c", emoji: "✨" },
  ];

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const totalWins = 24;

  return (
    <ScrollView style={styles.scrollView}>
      {/* Enhanced Greeting Header */}
      <View style={styles.greetingWrapper}>
        <View style={styles.greetingCard}>
          <View style={styles.greetingRow}>
            <Text style={styles.waveEmoji}>👋</Text>
            <Text style={styles.helloText}>Hello</Text>
          </View>
          <Text style={styles.meetText}>Nice to Meet You!</Text>
          <Text style={styles.subtitleText}>Today is a great day to grow</Text>
          <View style={styles.dinoRow}>
            <Text style={styles.dinoEmoji}>🦕</Text>
            <Text style={styles.dinoEmoji}>🦖</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Wins</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.streakRow}>
                <Text style={styles.fireEmoji}>🔥</Text>
                <Text style={styles.streakNumber}>7</Text>
              </View>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Calendar */}
      <View style={styles.sectionWrapper}>
        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity>
              <Ionicons name="chevron-back" size={24} color="#3b82f6" />
            </TouchableOpacity>
            <Text style={styles.monthText}>{currentMonth}</Text>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={24} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          {/* Day headers */}
          <View style={styles.dayHeaderRow}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Text key={day} style={styles.dayHeaderText}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View style={styles.calendarGrid}>
            {daysInMonth.map((day) => (
              <TouchableOpacity
                key={day}
                onPress={() => setSelectedDate(day)}
                style={[
                  styles.dayCell,
                  selectedDate === day && styles.dayCellSelected,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    selectedDate === day && styles.dayTextSelected,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Life Moments & Daily Wins Row */}
      <View style={styles.momentsWinsRow}>
        {/* Life Moments */}
        <View style={styles.momentCard}>
          <View style={styles.momentHeader}>
            <Text style={styles.cardTitle}>Life</Text>
            <TouchableOpacity style={{ padding: 4 }}>
              <Ionicons name="search" size={18} color="#9ca3af" />
            </TouchableOpacity>
          </View>
          <Text style={styles.cardTitle}>Moments</Text>
          <Text style={styles.momentDescription}>
            Capture small moments of joy
          </Text>
        </View>

        {/* Daily Wins */}
        <View style={styles.dailyWinsCard}>
          <Text style={[styles.cardTitle, { marginBottom: 16 }]}>Daily Wins</Text>
          {dailyWins.map((win) => (
            <View key={win.id} style={styles.winItem}>
              <Text style={styles.winEmoji}>{win.emoji}</Text>
              <Text style={styles.winTitle}>{win.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Enhanced Win Tracker */}
      <View style={styles.sectionWrapper}>
        <View style={styles.trackerCard}>
          <View style={styles.trackerHeader}>
            <Text style={styles.cardTitle}>Win Tracker</Text>
            <View style={styles.totalBadge}>
              <Text style={styles.totalBadgeText}>{totalWins} Total</Text>
            </View>
          </View>

          <View style={styles.trackerContent}>
            {/* Donut Chart */}
            <View style={styles.donutWrapper}>
              <View style={styles.donutOuter}>
                <View style={styles.donutInner}>
                  <Text style={styles.donutNumber}>{totalWins}</Text>
                  <Text style={styles.donutLabel}>wins</Text>
                </View>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.categoryList}>
              {winCategories.map((category) => (
                <View key={category.name} style={{ marginBottom: 12 }}>
                  <View style={styles.categoryRow}>
                    <View style={styles.categoryNameRow}>
                      <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                      <Text style={styles.categoryName}>{category.name}</Text>
                    </View>
                    <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${category.percentage}%`,
                          backgroundColor: category.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Enhanced Goal Path */}
      <View style={styles.goalPathWrapper}>
        <View style={styles.goalPathCard}>
          <View style={styles.goalPathHeader}>
            <Text style={styles.cardTitle}>Goal Path</Text>
            <View style={styles.completeBadge}>
              <Text style={styles.completeBadgeText}>3/5 Complete</Text>
            </View>
          </View>

          {/* Progress Line */}
          <View style={styles.milestonesRow}>
            {/* Connecting Line */}
            <View style={styles.connectingLine} />

            {/* Milestone Steps */}
            {[0, 1, 2, 3, 4].map((index) => (
              <View key={index} style={styles.milestoneItem}>
                <View
                  style={[
                    styles.milestoneCircle,
                    index < 3
                      ? styles.milestoneComplete
                      : index === 3
                        ? styles.milestoneCurrent
                        : styles.milestonePending,
                  ]}
                >
                  {index < 3 ? (
                    <Text style={styles.checkText}>✓</Text>
                  ) : index === 3 ? (
                    <Ionicons name="checkmark" size={24} color="#3b82f6" />
                  ) : (
                    <Text style={styles.arrowText}>→</Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.weekLabel,
                    index < 3
                      ? styles.weekLabelComplete
                      : index === 3
                        ? styles.weekLabelCurrent
                        : styles.weekLabelPending,
                  ]}
                >
                  Week {index + 1}
                </Text>
              </View>
            ))}
          </View>

          {/* Progress Info */}
          <View style={styles.progressInfoBox}>
            <View style={styles.progressInfoRow}>
              <Text style={styles.targetEmoji}>🎯</Text>
              <Text style={styles.progressInfoTitle}>Keep Up the Momentum!</Text>
            </View>
            <Text style={styles.progressInfoDesc}>
              You're on track! Just 2 more weeks to complete your goal.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  // Greeting
  greetingWrapper: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  greetingCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  waveEmoji: {
    fontSize: 28,
  },
  helloText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
  },
  meetText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 13,
    color: "#4b5563",
    marginBottom: 16,
  },
  dinoRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
  },
  dinoEmoji: {
    fontSize: 48,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 24,
    width: "100%",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2563eb",
  },
  statLabel: {
    fontSize: 11,
    color: "#4b5563",
    fontWeight: "500",
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  fireEmoji: {
    fontSize: 18,
  },
  streakNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f97316",
  },

  // Calendar
  sectionWrapper: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  calendarCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  dayHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dayHeaderText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6b7280",
    width: 40,
    textAlign: "center",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dayCell: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#ffffff",
  },
  dayCellSelected: {
    backgroundColor: "#3b82f6",
  },
  dayText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  dayTextSelected: {
    color: "#ffffff",
  },

  // Life Moments & Daily Wins
  momentsWinsRow: {
    paddingHorizontal: 24,
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  momentCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  momentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  momentDescription: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 12,
    lineHeight: 18,
  },
  dailyWinsCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  winItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  winEmoji: {
    fontSize: 22,
  },
  winTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
  },

  // Win Tracker
  trackerCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  trackerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  totalBadge: {
    backgroundColor: "#dbeafe",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  totalBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2563eb",
  },
  trackerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  donutWrapper: {
    width: 128,
    height: 128,
    alignItems: "center",
    justifyContent: "center",
  },
  donutOuter: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "#60a5fa",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  donutInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  donutNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
  },
  donutLabel: {
    fontSize: 11,
    color: "#4b5563",
    fontWeight: "500",
  },
  categoryList: {
    flex: 1,
    marginLeft: 24,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  categoryNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  categoryEmoji: {
    fontSize: 18,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  categoryPercentage: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1f2937",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 999,
  },

  // Goal Path
  goalPathWrapper: {
    paddingHorizontal: 24,
    marginBottom: 80,
  },
  goalPathCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  goalPathHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  completeBadge: {
    backgroundColor: "#dcfce7",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  completeBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#16a34a",
  },
  milestonesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    marginBottom: 32,
  },
  connectingLine: {
    position: "absolute",
    height: 4,
    backgroundColor: "#e5e7eb",
    top: 28,
    left: 24,
    right: 24,
    zIndex: -1,
  },
  milestoneItem: {
    alignItems: "center",
  },
  milestoneCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 4,
  },
  milestoneComplete: {
    backgroundColor: "#4ade80",
    borderColor: "#4ade80",
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  milestoneCurrent: {
    backgroundColor: "#dbeafe",
    borderColor: "#93c5fd",
  },
  milestonePending: {
    backgroundColor: "#f3f4f6",
    borderColor: "#e5e7eb",
  },
  checkText: {
    fontSize: 22,
  },
  arrowText: {
    fontSize: 18,
    color: "#9ca3af",
  },
  weekLabel: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    width: 48,
  },
  weekLabelComplete: {
    color: "#16a34a",
  },
  weekLabelCurrent: {
    color: "#2563eb",
  },
  weekLabelPending: {
    color: "#6b7280",
  },
  progressInfoBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  progressInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  targetEmoji: {
    fontSize: 18,
  },
  progressInfoTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e3a5f",
  },
  progressInfoDesc: {
    fontSize: 11,
    color: "#1d4ed8",
  },
});
