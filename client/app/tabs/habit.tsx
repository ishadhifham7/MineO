// client/app/tabs/habits.tsx
import { ScrollView, View, TextInput, Text, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, RefreshControl, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { colors } from "../../src/constants/colors";
import HabitHeader from "../../src/components/habit/HabitHeader";
import HabitCalendar from "../../src/components/habit/HabitCalendar";
import HabitStatusCard from "../../src/components/habit/HabitStatusCard";
import HabitRadarChart from "../../src/components/habit/HabitRadarChart";
import { HabitProvider, useHabit } from "../../src/features/habit/HabitContext";

// Get local date in YYYY-MM-DD format (not UTC)
const getLocalDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function HabitsContent() {
  const { activeTab, setActiveTab, visibleCalendar, radarValues, updateDailyHabit, isLoading, isSaving, error, refreshCalendar, refreshRadar } = useHabit();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const today = getLocalDate();

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
      <SafeAreaView style={[styles.container, styles.centered]} edges={['top']}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.mt4, styles.textMuted]}>Loading habits...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centered, styles.px6]} edges={['top']}>
        <Text style={[styles.textError, styles.textCenter, styles.mb4]}>Error loading habits</Text>
        <Text style={[styles.textMuted, styles.textCenter]}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex1}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          
          <HabitHeader active={activeTab} onChange={setActiveTab} />

          <View style={styles.contentContainer}>
            {/* Enlarged Calendar with existing design logic */}
            <View style={styles.shadowXl}>
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
                <View style={styles.savingContainer}>
                  <ActivityIndicator size="small" color={colors.text.muted} />
                  <Text style={styles.savingText}>Saving...</Text>
                </View>
              )}
            </View>

            {/* Analysis Section */}
            <View style={styles.analysisSection}>
              <HabitRadarChart values={radarValues} />
              <View style={styles.radarControls}>
                <Pressable 
                  onPress={async () => {
                    console.log('🔄 Manual radar refresh triggered');
                    await refreshRadar();
                  }}
                  style={({ pressed }) => [
                    styles.refreshButton,
                    pressed && styles.refreshButtonPressed
                  ]}
                >
                  <Text style={styles.refreshButtonText}>
                    🔄 Refresh Radar Data
                  </Text>
                </Pressable>
                <Text style={styles.refreshHint}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex1: {
    flex: 1,
  },
  px6: {
    paddingHorizontal: 24,
  },
  mt4: {
    marginTop: 16,
  },
  mb4: {
    marginBottom: 16,
  },
  textMuted: {
    color: colors.text.muted,
  },
  textError: {
    color: colors.error,
  },
  textCenter: {
    textAlign: 'center',
  },
  contentContainer: {
    paddingHorizontal: 24,
    gap: 32,
  },
  shadowXl: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  savingContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingText: {
    marginLeft: 8,
    fontSize: 12,
    color: colors.text.muted,
  },
  analysisSection: {
    marginTop: 16,
    paddingTop: 24,
  },
  radarControls: {
    alignItems: 'center',
    marginTop: 8,
  },
  refreshButton: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  refreshButtonPressed: {
    backgroundColor: colors.borderLight,
  },
  refreshButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text.secondary,
  },
  refreshHint: {
    fontSize: 9,
    color: colors.disabled,
    fontStyle: 'italic',
  },
});