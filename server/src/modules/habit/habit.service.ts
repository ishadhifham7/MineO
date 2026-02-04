import { firestore, Timestamp } from "../../config/firebase";
import * as admin from "firebase-admin";
import {
  HabitDailyResponse,
  HabitRadarResponse
} from "./habit.model";

const collection = firestore.collection("dailyStates");

export class HabitService {
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

    let mental = 0, physical = 0, spiritual = 0;
    let mCount = 0, pCount = 0, sCount = 0;

    snapshot.docs.forEach(doc => {
      const d = doc.data();
      if (d.mental != null) { mental += d.mental; mCount++; }
      if (d.physical != null) { physical += d.physical; pCount++; }
      if (d.spiritual != null) { spiritual += d.spiritual; sCount++; }
    });

    return {
      mental: mCount ? mental / mCount : 0,
      physical: pCount ? physical / pCount : 0,
      spiritual: sCount ? spiritual / sCount : 0
    };
  }
}
