import { Timestamp } from 'firebase-admin/firestore';

export interface HabitDailyDocument {
  userId: string; // REQUIRED: User who owns this daily state
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
  mental: {
    green: number;
    blue: number;
    red: number;
  };
  physical: {
    green: number;
    blue: number;
    red: number;
  };
  spiritual: {
    green: number;
    blue: number;
    red: number;
  };
}
