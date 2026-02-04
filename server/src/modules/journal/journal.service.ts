// journal.service.ts

import { JournalRepository } from './journal.repository';
import { JournalEntry, CanvasBlock } from './journal.types';
import { v4 as uuid } from 'uuid';

export class JournalService {
  static async getOrCreateDailyEntry(date: string) {
    const snapshot = await JournalRepository.entries().where('date', '==', date).limit(1).get();

    if (!snapshot.empty) {
      return snapshot.docs[0].data() as JournalEntry;
    }

    const now = Date.now();
    const entryId = uuid();

    const entry: JournalEntry = {
      id: entryId,
      date,
      isPinnedToTimeline: false,
      createdAt: now,
      updatedAt: now,
    };

    await JournalRepository.entryById(entryId).set(entry);
    return entry;
  }

  static async saveCanvas(entryId: string, blocks: CanvasBlock[]) {
    const entryRef = JournalRepository.entryById(entryId);
    const entrySnap = await entryRef.get();

    if (!entrySnap.exists) {
      throw new Error('Unauthorized or entry not found');
    }

    const batch = entryRef.firestore.batch();

    const oldBlocks = await JournalRepository.canvasBlocks(entryId).get();
    oldBlocks.docs.forEach((doc) => batch.delete(doc.ref));

    blocks.forEach((block) => {
      batch.set(JournalRepository.canvasBlockById(entryId, block.id), {
        ...block,
        updatedAt: Date.now(),
      });
    });

    batch.update(entryRef, { updatedAt: Date.now() });
    await batch.commit();
  }

  static async getFullJournal(entryId: string) {
    const entryRef = JournalRepository.entryById(entryId);
    const entrySnap = await entryRef.get();

    if (!entrySnap.exists) {
      throw new Error('Unauthorized or entry not found');
    }

    const blocksSnap = await JournalRepository.canvasBlocks(entryId).get();

    return {
      entry: entrySnap.data(),
      blocks: blocksSnap.docs.map((d) => d.data()),
    };
  }

  static async toggleTimelinePin(entryId: string, value: boolean) {
    const entryRef = JournalRepository.entryById(entryId);
    const snap = await entryRef.get();

    if (!snap.exists) {
      throw new Error('Unauthorized');
    }

    await entryRef.update({
      isPinnedToTimeline: value,
      updatedAt: Date.now(),
    });
  }
}
