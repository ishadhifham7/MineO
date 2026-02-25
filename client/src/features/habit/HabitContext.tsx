import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import type { Category, CalendarData, RadarApiResponse } from "./habit.types";
import { getCalendar, getRadar, patchDailyHabit } from "../../services/habit.service";

interface HabitContextType {
  activeTab: Category;
  setActiveTab: (tab: Category) => void;
  visibleCalendar: Record<string, number | undefined>;
  radarValues: number[];
  updateDailyHabit: (date: string, category: Category, value: number) => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  refreshCalendar: () => Promise<void>;
  refreshRadar: () => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

interface HabitProviderProps {
  children: ReactNode;
}

export function HabitProvider({ children }: HabitProviderProps) {
  const [activeTab, setActiveTab] = useState<Category>("spiritual");
  const [calendarData, setCalendarData] = useState<CalendarData>({});
  const [radarValues, setRadarValues] = useState<number[]>([0, 0, 0]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([loadCalendar(), loadRadar()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load habit data");
      console.error("Error loading habit data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadCalendar() {
    try {
      const data = await getCalendar();
      setCalendarData(data);
    } catch (err) {
      console.error("Error loading calendar:", err);
      throw err;
    }
  }

  async function loadRadar() {
    try {
      const data: RadarApiResponse = await getRadar();
      console.log('📊 Radar data received:', {
        spiritual: `G:${data.spiritual.green} B:${data.spiritual.blue} R:${data.spiritual.red}`,
        mental: `G:${data.mental.green} B:${data.mental.blue} R:${data.mental.red}`,
        physical: `G:${data.physical.green} B:${data.physical.blue} R:${data.physical.red}`
      });
      
      const spiritualScore = calculateScore(data.spiritual);
      const mentalScore = calculateScore(data.mental);
      const physicalScore = calculateScore(data.physical);
      
      console.log('📈 Calculated scores:', {
        spiritual: `${spiritualScore}%`,
        mental: `${mentalScore}%`,
        physical: `${physicalScore}%`
      });
      
      setRadarValues([spiritualScore, mentalScore, physicalScore]);
    } catch (err) {
      console.error("❌ Error loading radar:", err);
      throw err;
    }
  }

  function calculateScore(data: { green: number; blue: number; red: number }) {
    const points = data.green * 1 + data.blue * 0.5;
    const percentage = Math.round((points / 7) * 100);
    console.log(`🧮 Score calculation: ${data.green}G + ${data.blue}B = ${points} points / 7 = ${percentage}%`);
    return percentage;
  }

  const visibleCalendar = useMemo(() => {
    return Object.entries(calendarData).reduce<Record<string, number | undefined>>(
      (acc, [date, scores]) => {
        acc[date] = scores?.[activeTab];
        return acc;
      },
      {}
    );
  }, [calendarData, activeTab]);

  async function updateDailyHabit(
    date: string,
    category: Category,
    value: number
  ) {
    const previous = calendarData[date]?.[category] ?? 0;

    // Optimistic update
    setCalendarData((prev) => ({
      ...prev,
      [date]: { ...prev[date], [category]: value },
    }));

    setIsSaving(true);
    try {
      await patchDailyHabit(date, category, value);
      console.log(`✅ Habit updated: ${category} = ${value === 1 ? 'Good' : value === 0.5 ? 'Average' : 'Bad'}`);
      console.log('🔄 Refreshing radar data...');
      // Reload radar after successful update
      await loadRadar();
      console.log('✅ Radar data refreshed!');
    } catch (err) {
      // Rollback on error
      setCalendarData((prev) => ({
        ...prev,
        [date]: { ...prev[date], [category]: previous },
      }));
      console.error("❌ Error updating habit:", err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }

  const value: HabitContextType = {
    activeTab,
    setActiveTab,
    visibleCalendar,
    radarValues,
    updateDailyHabit,
    isLoading,
    isSaving,
    error,
    refreshCalendar: loadCalendar,
    refreshRadar: loadRadar,
  };

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabit() {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error("useHabit must be used within a HabitProvider");
  }
  return context;
}
