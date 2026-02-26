export type Category = "spiritual" | "mental" | "physical";

export type DailyHabitScores = {
  spiritual?: number; // 1 | 0.5 | 0
  mental?: number;
  physical?: number;
};

export type CalendarData = Record<string, DailyHabitScores>;

export type RadarBackendData = {
  green: number;
  blue: number;
  red: number;
};

export type RadarApiResponse = {
  spiritual: RadarBackendData;
  mental: RadarBackendData;
  physical: RadarBackendData;
};