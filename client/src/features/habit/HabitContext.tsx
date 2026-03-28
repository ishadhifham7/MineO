import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import type { Category, CalendarData, RadarApiResponse } from "./habit.types";
import {
  getCalendar,
  getRadar,
  patchDailyHabit,
} from "../../services/habit.service";

interface HabitContextType {
  activeTab: Category;
  setActiveTab: (tab: Category) => void;
  visibleCalendar: Record<string, number | undefined>;
  radarValues: number[];
  updateDailyHabit: (
    date: string,
    category: Category,
    value: number,
  ) => Promise<void>;
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
      setError(
        err instanceof Error ? err.message : "Failed to load habit data",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function loadCalendar() {
    try {
      const data = await getCalendar();
      setCalendarData(data);
    } catch (err) {
      throw err;
    }
  }

  async function loadRadar() {
    try {
      const data: RadarApiResponse = await getRadar();

      const spiritualScore = calculateScore(data.spiritual);
      const mentalScore = calculateScore(data.mental);
      const physicalScore = calculateScore(data.physical);

      setRadarValues([spiritualScore, mentalScore, physicalScore]);
    } catch (err) {
      throw err;
    }
  }

  function calculateScore(data: { green: number; blue: number; red: number }) {
    const points = data.green * 1 + data.blue * 0.5;
    const percentage = Math.round((points / 7) * 100);
    return percentage;
  }

  const visibleCalendar = useMemo(() => {
    const result = Object.entries(calendarData).reduce<
      Record<string, number | undefined>
    >((acc, [date, scores]) => {
      acc[date] = scores?.[activeTab];
      return acc;
    }, {});
    return result;
  }, [calendarData, activeTab]);

  async function updateDailyHabit(
    date: string,
    category: Category,
    value: number,
  ) {
    const previous = calendarData[date]?.[category];

    // Optimistic update
    setCalendarData((prev) => ({
      ...prev,
      [date]: { ...prev[date], [category]: value },
    }));

    setIsSaving(true);
    try {
      await patchDailyHabit(date, category, value);
      // Reload radar after successful update
      await loadRadar();
    } catch (err) {
      // Rollback on error
      setCalendarData((prev) => {
        const dayData = { ...prev[date] };
        if (previous === undefined) {
          delete dayData[category];
        } else {
          dayData[category] = previous;
        }
        return {
          ...prev,
          [date]: dayData,
        };
      });
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
    <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
  );
}

export function useHabit() {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error("useHabit must be used within a HabitProvider");
  }
  return context;
}
