import React from "react";
import { ScrollView, View, TextInput, StyleSheet } from "react-native";
import HabitHeader from "../../src/components/habit/HabitHeader";
import HabitCalendar from "../../src/components/habit/HabitCalendar";
import HabitStatusCard from "../../src/components/habit/HabitStatusCard";
import HabitRadarChart from "../../src/components/habit/HabitRadarChart";
import useHabitTracker from "../../src/features/habit/habit.logic";

export default function HabitsScreen() {
  const { activeTab, setActiveTab, visibleCalendar, radarData, updateDailyHabit } = useHabitTracker();
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <HabitHeader active={activeTab} onChange={setActiveTab} />

      <HabitCalendar category={activeTab} data={visibleCalendar} />

      <View style={styles.cardsContainer}>
        {(["spiritual", "mental", "physical"] as const).map((cat) => (
          <HabitStatusCard
            key={cat}
            title={cat}
            onSelect={(value) => updateDailyHabit(today, cat, value)}
          />
        ))}
      </View>

      <HabitRadarChart data={radarData} />

      <View style={styles.feedbackContainer}>
        <TextInput
          multiline
          placeholder="Your Feedback For This Month"
          placeholderTextColor="#999"
          style={styles.feedbackInput}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#B5A993",
  },
  content: {
    paddingBottom: 120,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  feedbackContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  feedbackInput: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    height: 128,
    fontSize: 16,
    textAlignVertical: "top",
  },
});
