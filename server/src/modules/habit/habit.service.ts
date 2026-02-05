import { firestore, Timestamp } from "../../config/firebase";
import * as admin from "firebase-admin";
import {
  HabitDailyResponse,
  HabitRadarResponse
} from "./habit.model";

const collection = firestore.collection("dailyStates");

export class HabitService {
  // CREATE OR UPDATE DAILY HABIT (UPSERT)
  static async upsertDailyHabit(date: string, payload: any) {
    const docRef = collection.doc(date);

    await docRef.set(
      {
        date: Timestamp.fromDate(new Date(date)),
        ...payload,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );
  }

  // GET MONTHLY CALENDAR DATA
  static async getMonthlyCalendar(month: string): Promise<HabitDailyResponse[]> {
    const [year, monthIndex] = month.split("-").map(Number);

    const start = Timestamp.fromDate(
      new Date(Date.UTC(year, monthIndex - 1, 1))
    );
    const end = Timestamp.fromDate(
      new Date(Date.UTC(year, monthIndex, 0, 23, 59, 59))
    );

    const snapshot = await collection
      .where("date", ">=", start)
      .where("date", "<=", end)
      .get();

    return snapshot.docs.map(doc => {
      const d = doc.data();
      return {
        date: d.date.toDate().toISOString().split("T")[0],
        mental: d.mental ?? null,
        physical: d.physical ?? null,
        spiritual: d.spiritual ?? null
      };
    });
  }

  // GET WEEKLY RADAR DATA (PERCENTAGE BASED)
  static async getRadarData(
    startDate: string,
    endDate: string
  ): Promise<HabitRadarResponse> {
    const start = Timestamp.fromDate(new Date(startDate));
    const end = Timestamp.fromDate(new Date(endDate));

    const snapshot = await collection
      .where("date", ">=", start)
      .where("date", "<=", end)
      .get();

    let mental = 0;
    let physical = 0;
    let spiritual = 0;

    snapshot.docs.forEach(doc => {
      const d = doc.data();
      mental += d.mental ?? 0;
      physical += d.physical ?? 0;
      spiritual += d.spiritual ?? 0;
    });

    const MAX_DAYS = 7; // weekly normalization
    const toPercentage = (value: number) =>
      Math.round((value / MAX_DAYS) * 100 * 100) / 100;

    return {
      mental: toPercentage(mental),
      physical: toPercentage(physical),
      spiritual: toPercentage(spiritual)
    };
  }
}
