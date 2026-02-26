import { useEffect, useState, useMemo } from "react";
import type {
  Category,
  CalendarData,
  RadarApiResponse,
} from "./habit.types";
import {
  getCalendar,
  getRadar,
  patchDailyHabit,
} from "../../services/habit.service";

export function useHabitTracker() {
  const [activeTab, setActiveTab] = useState<Category>("spiritual");
  const [calendarData, setCalendarData] = useState<CalendarData>({});
  const [radarValues, setRadarValues] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    loadCalendar();
    loadRadar();
  }, []);

  async function loadCalendar() {
    const data = await getCalendar();
    setCalendarData(data);
  }

  async function loadRadar() {
    const data: RadarApiResponse = await getRadar();

    setRadarValues([
      calculateScore(data.spiritual),
      calculateScore(data.mental),
      calculateScore(data.physical),
    ]);
  }

  function calculateScore(data: { green: number; blue: number; red: number }) {
    const points = data.green * 1 + data.blue * 0.5;
    return Math.round((points / 7) * 100);
  }

  const visibleCalendar = useMemo(() => {
    return Object.entries(calendarData).reduce<Record<string, number>>(
      (acc, [date, scores]) => {
        acc[date] = scores?.[activeTab] ?? 0;
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

    try {
      await patchDailyHabit(date, category, value);
      loadRadar();
    } catch {
      // rollback
      setCalendarData((prev) => ({
        ...prev,
        [date]: { ...prev[date], [category]: previous },
      }));
    }
  }

  return {
    activeTab,
    setActiveTab,
    visibleCalendar,
    radarValues,
    updateDailyHabit,
  };
}