import { useState, useEffect } from "react";
import { Category, DailyScore, CalendarData, RadarData } from "./habit.types";

// Lightweight client-side stubs for habit API calls (replace with real services)
const getCalendar = async () => ({} as Record<string, DailyScore>);
const getRadar = async () => ({
  spiritual: { green: 0, blue: 0, red: 0 },
  mental: { green: 0, blue: 0, red: 0 },
  physical: { green: 0, blue: 0, red: 0 },
});
const patchDailyHabit = async (_date: string, _category: Category, _value: number) => Promise.resolve();

export const useHabitTracker = () => {
  const [activeTab, setActiveTab] = useState<Category>("spiritual");
  const [calendarData, setCalendarData] = useState<CalendarData>({});
  const [radarData, setRadarData] = useState<RadarData>({ labels: [], values: [] });

  useEffect(() => {
    fetchCalendar();
    fetchRadar();
  }, []);

  const fetchCalendar = async () => {
    try {
      const data = await getCalendar();
      setCalendarData(data);
    } catch (e) {
      console.error("Failed to fetch calendar:", e);
    }
  };

  const fetchRadar = async () => {
    try {
      const data = await getRadar(); // { spiritual:{green:3,blue:2,red:2}, ... }
      setRadarData(mapRadarData(data));
    } catch (e) {
      console.error("Failed to fetch radar:", e);
    }
  };

  const getVisibleCalendar = (): Record<string, number> => {
    return Object.keys(calendarData).reduce((acc: Record<string, number>, date) => {
      acc[date] = calendarData[date][activeTab] ?? 0;
      return acc;
    }, {});
  };

  const updateDailyHabit = async (date: string, category: Category, value: number) => {
    const prevValue = calendarData[date]?.[category] ?? 0;

    // Optimistic UI
    setCalendarData((prev) => ({
      ...prev,
      [date]: { ...prev[date], [category]: value },
    }));

    try {
      await patchDailyHabit(date, category, value);
    } catch (e) {
      console.error("Failed to patch daily habit:", e);
      setCalendarData((prev) => ({
        ...prev,
        [date]: { ...prev[date], [category]: prevValue },
      }));
    }

    fetchRadar();
  };

  const calculateScore = (counts: { green: number; blue: number; red: number }) => {
    const totalPoints = counts.green * 1 + counts.blue * 0.5 + counts.red * 0;
    const maxPoints = 7;
    return (totalPoints / maxPoints) * 100;
  };

  const mapRadarData = (data: Record<Category, { green: number; blue: number; red: number }>): RadarData => {
    const labels = ["Spiritual", "Mental", "Physical"];
    const values = [
      calculateScore(data.spiritual),
      calculateScore(data.mental),
      calculateScore(data.physical),
    ];
    return { labels, values };
  };

  return {
    activeTab,
    setActiveTab,
    calendarData,
    visibleCalendar: getVisibleCalendar(),
    radarData,
    updateDailyHabit,
  };
};

export default useHabitTracker;
