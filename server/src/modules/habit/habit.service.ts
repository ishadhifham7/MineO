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
    // Delete any duplicate documents with malformed IDs for this date
    const dateParts = date.split('-').map(Number);
    const utcDate = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]));
    const dateTimestamp = Timestamp.fromDate(utcDate);
    
    const duplicates = await collection
      .where("date", "==", dateTimestamp)
      .get();
    
    for (const doc of duplicates.docs) {
      if (doc.id !== date) {
        await doc.ref.delete();
      }
    }
    
    const docRef = collection.doc(date);

    const updateData = {
      date: dateTimestamp,
      ...payload,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await docRef.set(updateData, { merge: true });
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

    const counts = {
      mental: { green: 0, blue: 0, red: 0 },
      physical: { green: 0, blue: 0, red: 0 },
      spiritual: { green: 0, blue: 0, red: 0 }
    };

    snapshot.docs.forEach(doc => {
      const d = doc.data();
      
      // Count mental values
      if (d.mental === 1) counts.mental.green++;
      else if (d.mental === 0.5) counts.mental.blue++;
      else if (d.mental === 0) counts.mental.red++;
      
      // Count physical values
      if (d.physical === 1) counts.physical.green++;
      else if (d.physical === 0.5) counts.physical.blue++;
      else if (d.physical === 0) counts.physical.red++;
      
      // Count spiritual values
      if (d.spiritual === 1) counts.spiritual.green++;
      else if (d.spiritual === 0.5) counts.spiritual.blue++;
      else if (d.spiritual === 0) counts.spiritual.red++;
    });

    return counts;
  }
}
