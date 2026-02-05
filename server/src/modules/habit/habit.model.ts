import { Timestamp } from "firebase-admin/firestore";

export interface HabitDailyDocument {
  date: Timestamp;
  mental?: number | null;
  physical?: number | null;
  spiritual?: number | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface HabitDailyResponse {
  date: string; // YYYY-MM-DD
  mental: number | null;
  physical: number | null;
  spiritual: number | null;
}

export interface HabitRadarResponse {
  mental: number;
  physical: number;
  spiritual: number;
}
