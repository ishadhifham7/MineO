// client/app/tabs/habits.tsx
import {
  ScrollView,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Pressable,
} from "react-native";
import { useState } from "react";
import HabitHeader from "../../src/components/habit/HabitHeader";
import HabitCalendar from "../../src/components/habit/HabitCalendar";
import HabitStatusCard from "../../src/components/habit/HabitStatusCard";
import HabitRadarChart from "../../src/components/habit/HabitRadarChart";
import { HabitProvider, useHabit } from "../../src/features/habit/HabitContext";
import {
  HomeStyleScreen,
  SectionCard,
} from "../../src/components/ui/HomeStyleScreen";

// Get local date in YYYY-MM-DD format (not UTC)
const getLocalDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function HabitsContent() {
  const {
    activeTab,
    setActiveTab,
    visibleCalendar,
    radarValues,
    updateDailyHabit,
    isLoading,
    isSaving,
    error,
    refreshCalendar,
    refreshRadar,
  } = useHabit();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const today = getLocalDate();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refreshCalendar(), refreshRadar()]);
      console.log('Data refreshed successfully');
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleStatusSelect = async (value: number) => {
    try {
      await updateDailyHabit(today, activeTab, value);
    } catch (err) {
      Alert.alert(
        "Error",
        "Failed to update habit. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  if (isLoading) {
    return (
      <HomeStyleScreen
        kicker="Daily Rhythm"
        title="Habit Studio"
        subtitle="Track your mind, body, and spirit every day"
        scrollable={false}
      >
        <SectionCard style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 10 }}>
          <ActivityIndicator size="large" color="#6B645C" />
          <Text className="text-gray-600">Loading habits...</Text>
        </SectionCard>
      </HomeStyleScreen>
    );
  }

  if (error) {
    return (
      <HomeStyleScreen
        kicker="Daily Rhythm"
        title="Habit Studio"
        subtitle="Track your mind, body, and spirit every day"
        scrollable={false}
      >
        <SectionCard style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Text className="text-red-600 text-center">Error loading habits</Text>
          <Text className="text-gray-600 text-center">{error}</Text>
        </SectionCard>
      </HomeStyleScreen>
    );
  }

  return (
    <HomeStyleScreen
      kicker="Daily Rhythm"
      title="Habit Studio"
      subtitle="Track your mind, body, and spirit every day"
      stats={[
        { value: activeTab, label: "Focus" },
        { value: today, label: "Today" },
      ]}
      scrollable={false}
      contentContainerStyle={{ flex: 1, paddingBottom: 90 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 116, paddingHorizontal: 16, gap: 12 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#8C7F6A"
              colors={["#8C7F6A"]}
            />
          }
        >
          <SectionCard>
            <HabitHeader active={activeTab} onChange={setActiveTab} />
          </SectionCard>

          <SectionCard>
            <View>
              <Text className="text-[#2E2A26] text-[17px] font-semibold mb-3 px-1">Calendar</Text>
              <HabitCalendar category={activeTab} data={visibleCalendar} />
            </View>
          </SectionCard>

          <SectionCard>
            <View>
              <Text className="text-[#2E2A26] text-[17px] font-semibold mb-3 px-1">Daily Check In</Text>
              <HabitStatusCard
                title={activeTab}
                onSelect={handleStatusSelect}
                selectedValue={visibleCalendar[today]}
              />
              {isSaving && (
                <View className="mt-2 flex-row items-center justify-center">
                  <ActivityIndicator size="small" color="#8C7F6A" />
                  <Text className="ml-2 text-[12px] text-[#6B645C]">Saving...</Text>
                </View>
              )}
            </View>
          </SectionCard>

          <SectionCard>
            <View>
              <Text className="text-[#2E2A26] text-[17px] font-semibold mb-3 px-1">Weekly Analysis</Text>
              <HabitRadarChart values={radarValues} />
              <View className="items-center mt-3">
                <Pressable
                  onPress={async () => {
                    console.log('Manual radar refresh triggered');
                    await refreshRadar();
                  }}
                  className="bg-[#EEE7DB] active:bg-[#E3DBCD] px-5 py-2 rounded-full"
                >
                  <Text className="text-[10px] font-bold text-gray-700">
                    Refresh Radar Data
                  </Text>
                </Pressable>
                <Text className="text-[9px] text-gray-400 italic">
                  Pull down to refresh - Updates automatically on save
                </Text>
              </View>
            </View>
          </SectionCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </HomeStyleScreen>
  );
}

export default function HabitsScreen() {
  return (
    <HabitProvider>
      <HabitsContent />
    </HabitProvider>
  );
}
