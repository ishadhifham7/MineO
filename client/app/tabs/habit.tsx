import React from "react";
import { ScrollView, View, TextInput } from "react-native";
import HabitHeader from "../../src/components/habit/HabitHeader";
import HabitCalendar from "../../src/components/habit/HabitCalendar";
import HabitStatusCard from "../../src/components/habit/HabitStatusCard";
import HabitRadarChart from "../../src/components/habit/HabitRadarChart";
import useHabitTracker from "../../src/features/habit/habit.logic";

export default function HabitsScreen() {
  const { 
    activeTab, 
    setActiveTab, 
    visibleCalendar, 
    radarData, 
    updateDailyHabit 
  } = useHabitTracker();

  const today = "2026-02-08"; // you can dynamically set this

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 120 }}
      className="flex-1 bg-[#B5A993]"
    >
      <HabitHeader active={activeTab} onChange={setActiveTab} />

      {React.createElement(HabitCalendar as any, { category: activeTab, data: visibleCalendar })}

      <View className="px-4 mt-4 space-y-3">
          {["spiritual", "mental", "physical"].map((cat) => (
            React.createElement(HabitStatusCard as any, {
              key: cat,
              title: cat,
              onSelect: (value: number) => updateDailyHabit(today, cat as any, value),
            })
          ))}
      </View>

      {React.createElement(HabitRadarChart as any, { data: radarData })}

      <View className="px-4 mt-6">
        <TextInput
          multiline
          placeholder="Your Feedback For This Month"
          placeholderTextColor="#999"
          className="bg-white rounded-2xl p-4 h-32 text-base"
        />
      </View>
    </ScrollView>
  );
}
