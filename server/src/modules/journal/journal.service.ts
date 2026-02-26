import { JournalRepository } from './journal.repository';
import { JournalEntry, JournalBlock } from './journal.types';
import { v4 as uuid } from 'uuid';

export class JournalService {
  // 🔹 get by date (NO auto create)
  static async getJournalByDate(date: string) {
    const snap = await JournalRepository.entries().where('date', '==', date).limit(1).get();

    if (snap.empty) return null;

    const entry = snap.docs[0].data() as JournalEntry;
    const blocksSnap = await JournalRepository.canvasBlocks(entry.id).get();

    return {
      ...entry,
      blocks: blocksSnap.docs.map((d: any) => d.data()),
    };
  }

  // 🔹 create entry (first save)
  static async createJournal({
    date,
    title,
    isPinnedToTimeline = false,
    blocks,
  }: {
    date: string;
    title?: string;
    isPinnedToTimeline?: boolean;
    blocks: JournalBlock[];
  }) {
    const now = Date.now();
    const entryId = uuid();

    const entry: JournalEntry = {
      id: entryId,
      date,
      title,
      isPinnedToTimeline,
      createdAt: now,
      updatedAt: now,
    };

    const batch = JournalRepository.entries().firestore.batch();

    batch.set(JournalRepository.entryById(entryId), entry);

    blocks.forEach((block) => {
      batch.set(JournalRepository.canvasBlockById(entryId, block.id), block);
    });

    await batch.commit();
    return entry;
  }

  // 🔹 update canvas only
  static async updateCanvas(entryId: string, blocks: JournalBlock[]) {
    const entryRef = JournalRepository.entryById(entryId);
    const snap = await entryRef.get();

    if (!snap.exists) throw new Error('Entry not found');

    const batch = entryRef.firestore.batch();

    const oldBlocks = await JournalRepository.canvasBlocks(entryId).get();
    oldBlocks.docs.forEach((doc: any) => batch.delete(doc.ref));

    blocks.forEach((block) => {
      batch.set(JournalRepository.canvasBlockById(entryId, block.id), block);
    });

    batch.update(entryRef, { updatedAt: Date.now() });
    await batch.commit();
  }

  // 🔹 update metadata only
  static async updateMeta(entryId: string, meta: { title?: string; isPinnedToTimeline?: boolean }) {
    const entryRef = JournalRepository.entryById(entryId);
    const snap = await entryRef.get();

    if (!snap.exists) throw new Error('Entry not found');

    await entryRef.update({
      ...meta,
      updatedAt: Date.now(),
    });
  }

  // 🔹 get full journal by id
  static async getFullJournal(entryId: string) {
    const entryRef = JournalRepository.entryById(entryId);
    const snap = await entryRef.get();

    if (!snap.exists) throw new Error('Entry not found');

    const blocksSnap = await JournalRepository.canvasBlocks(entryId).get();

    return {
      entry: snap.data(),
      blocks: blocksSnap.docs.map((d: any) => d.data()),
    };
  }
}
