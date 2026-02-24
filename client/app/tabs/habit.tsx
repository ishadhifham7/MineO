// client/app/tabs/habits.tsx
import { ScrollView, View, TextInput, Text, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HabitHeader from "../../src/components/habit/HabitHeader";
import HabitCalendar from "../../src/components/habit/HabitCalendar";
import HabitStatusCard from "../../src/components/habit/HabitStatusCard";
import HabitRadarChart from "../../src/components/habit/HabitRadarChart";
import { useHabitTracker } from "../../src/features/habit/habit.logic";

export default function HabitsScreen() {
  const { activeTab, setActiveTab, visibleCalendar, radarValues, updateDailyHabit } = useHabitTracker();
  const today = "2026-02-08"; 

  return (
    <SafeAreaView className="flex-1 bg-[#A8A08E]" edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          
          <HabitHeader active={activeTab} onChange={setActiveTab} />

          <View className="px-6 space-y-8">
            {/* Enlarged Calendar with existing design logic */}
            <View className="shadow-xl">
               <HabitCalendar category={activeTab} data={visibleCalendar} />
            </View>

            {/* Habit Loggers */}
            <View className="space-y-4">
              {(["spiritual", "mental", "physical"] as const).map((cat) => (
                <HabitStatusCard
                  key={cat}
                  title={cat}
                  onSelect={(v) => updateDailyHabit(today, cat, v)}
                />
              ))}
            </View>

            {/* Analysis Section */}
            <View className="mt-4 pt-6">
              <HabitRadarChart values={radarValues} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}