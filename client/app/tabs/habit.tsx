// client/app/tabs/habits.tsx
import { ScrollView, View, TextInput, Text, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, RefreshControl, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import HabitHeader from "../../src/components/habit/HabitHeader";
import HabitCalendar from "../../src/components/habit/HabitCalendar";
import HabitStatusCard from "../../src/components/habit/HabitStatusCard";
import HabitRadarChart from "../../src/components/habit/HabitRadarChart";
import { HabitProvider, useHabit } from "../../src/features/habit/HabitContext";

function HabitsContent() {
  const { activeTab, setActiveTab, visibleCalendar, radarValues, updateDailyHabit, isLoading, isSaving, error, refreshCalendar, refreshRadar } = useHabit();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refreshCalendar(), refreshRadar()]);
      console.log('✅ Data refreshed successfully');
    } catch (err) {
      console.error('❌ Error refreshing data:', err);
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
      <SafeAreaView className="flex-1 bg-[#EFEFEF] items-center justify-center" edges={['top']}>
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-4 text-gray-600">Loading habits...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-[#EFEFEF] items-center justify-center px-6" edges={['top']}>
        <Text className="text-red-600 text-center mb-4">Error loading habits</Text>
        <Text className="text-gray-600 text-center">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#EFEFEF]" edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#000"
              colors={["#000"]}
            />
          }
        >
          
          <HabitHeader active={activeTab} onChange={setActiveTab} />

          <View className="px-6 space-y-8">
            {/* Enlarged Calendar with existing design logic */}
            <View className="shadow-xl">
               <HabitCalendar category={activeTab} data={visibleCalendar} />
            </View>

            {/* Habit Logger */}
            <View>
              <HabitStatusCard
                title={activeTab}
                onSelect={handleStatusSelect}
                selectedValue={visibleCalendar[today]}
              />
              {isSaving && (
                <View className="mt-2 flex-row items-center justify-center">
                  <ActivityIndicator size="small" color="#666" />
                  <Text className="ml-2 text-xs text-gray-600">Saving...</Text>
                </View>
              )}
            </View>

            {/* Analysis Section */}
            <View className="mt-4 pt-6">
              <HabitRadarChart values={radarValues} />
              <View className="items-center mt-2">
                <Pressable 
                  onPress={async () => {
                    console.log('🔄 Manual radar refresh triggered');
                    await refreshRadar();
                  }}
                  className="bg-gray-100 active:bg-gray-200 px-4 py-2 rounded-full mb-2"
                >
                  <Text className="text-[10px] font-bold text-gray-700">
                    🔄 Refresh Radar Data
                  </Text>
                </Pressable>
                <Text className="text-[9px] text-gray-400 italic">
                  Pull down to refresh • Updates automatically on save
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