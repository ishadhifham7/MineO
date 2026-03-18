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
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import HabitHeader from "../../src/components/habit/HabitHeader";
import HabitCalendar from "../../src/components/habit/HabitCalendar";
import HabitStatusCard from "../../src/components/habit/HabitStatusCard";
import HabitRadarChart from "../../src/components/habit/HabitRadarChart";
import { HabitProvider, useHabit } from "../../src/features/habit/HabitContext";

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
      console.log("Data refreshed successfully");
    } catch (err) {
      console.error("Error refreshing data:", err);
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
      <SafeAreaView className="flex-1 bg-[#F6F1E7] items-center justify-center" edges={["left", "right"]}>
        <ActivityIndicator size="large" color="#8C7F6A" />
        <Text className="mt-4 text-[#6B645C] text-[15px] font-medium">Loading habits...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-[#F6F1E7] items-center justify-center px-6" edges={["left", "right"]}>
        <Text className="text-[#E53935] text-center mb-3 text-[16px] font-semibold">Error loading habits</Text>
        <Text className="text-[#6B645C] text-center text-[14px]">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F6F1E7]" edges={["left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 116 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#8C7F6A"
              colors={["#8C7F6A"]}
            />
          }
        >
          <HabitHeader active={activeTab} onChange={setActiveTab} />

          <View className="px-4 pt-1 gap-5">
            <View>
              <Text className="text-[#2E2A26] text-[17px] font-semibold mb-3 px-1">Calendar</Text>
              <HabitCalendar category={activeTab} data={visibleCalendar} />
            </View>

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

            <View>
              <Text className="text-[#2E2A26] text-[17px] font-semibold mb-3 px-1">Weekly Analysis</Text>
              <HabitRadarChart values={radarValues} />
              <View className="items-center mt-3">
                <Pressable
                  onPress={async () => {
                    console.log("Manual radar refresh triggered");
                    await refreshRadar();
                  }}
                  className="bg-[#EEE7DB] active:bg-[#E3DBCD] px-5 py-2 rounded-full"
                >
                  <Text className="text-[12px] font-semibold text-[#6B645C]">
                    Refresh Radar Data
                  </Text>
                </Pressable>
                <Text className="text-[11px] text-[#8C7F6A] mt-2">
                  Pull down to refresh - Updates automatically on save
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function HabitsScreen() {
  return (
    <HabitProvider>
      <HabitsContent />
    </HabitProvider>
  );
}
