import { JournalRepository } from './journal.repository';
import { JournalEntry, JournalBlock, TextBlock } from './journal.types';
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
      blocks: blocksSnap.docs.map((d) => d.data()),
    };
  }

  // 🔹 create entry (upsert – one entry per date)
  static async createJournal({
    date,
    title,
    chapters,
    isPinnedToTimeline = false,
    blocks,
  }: {
    date: string;
    title?: string;
    chapters?: string[];
    isPinnedToTimeline?: boolean;
    blocks: JournalBlock[];
  }) {
    // ── Check if an entry already exists for this date ──────────────────────
    const existing = await JournalRepository.entries()
      .where('date', '==', date)
      .limit(1)
      .get();

    if (!existing.empty) {
      // Update the existing entry instead of creating a duplicate
      const existingEntry = existing.docs[0].data() as JournalEntry;
      const entryId = existingEntry.id;

      await JournalService.updateCanvas(entryId, blocks);

      if (title !== undefined || isPinnedToTimeline !== undefined) {
        await JournalService.updateMeta(entryId, { title, isPinnedToTimeline });
      }

      return { ...existingEntry, updatedAt: Date.now() };
    }

    // ── No existing entry – create a fresh one ───────────────────────────────
    const now = Date.now();
    const entryId = uuid();

    // Derive summary from first text block
    const firstText = blocks.find((b) => b.type === 'text') as TextBlock | undefined;
    const summary = firstText
      ? firstText.text.slice(0, 120) + (firstText.text.length > 120 ? '...' : '')
      : '';

    const entry: JournalEntry = {
      id: entryId,
      date,
      title,
      chapters: chapters || [],
      isPinnedToTimeline,
      createdAt: now,
      updatedAt: now,
      summary,
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

    // Derive summary from first text block
    const firstText = blocks.find((b) => b.type === 'text') as TextBlock | undefined;
    const summary = firstText
      ? firstText.text.slice(0, 120) + (firstText.text.length > 120 ? '...' : '')
      : '';

    const batch = entryRef.firestore.batch();

    const oldBlocks = await JournalRepository.canvasBlocks(entryId).get();
    oldBlocks.docs.forEach((doc) => batch.delete(doc.ref));

    blocks.forEach((block) => {
      batch.set(JournalRepository.canvasBlockById(entryId, block.id), block);
    });

    batch.update(entryRef, { updatedAt: Date.now(), summary });
    await batch.commit();
  }

  // 🔹 update metadata only
  static async updateMeta(entryId: string, meta: { title?: string; chapters?: string[]; isPinnedToTimeline?: boolean }) {
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
      blocks: blocksSnap.docs.map((d) => d.data()),
    };
  }

  // 🔹 get journals by date range (for calendar) – one entry per date, no block fetch
  static async getJournalsByDateRange(startDate: string, endDate: string) {
    const snap = await JournalRepository.entries()
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .get();

    // Deduplicate: keep only the earliest entry per date (createdAt asc)
    const uniqueByDate = new Map<string, JournalEntry>();
    for (const doc of snap.docs) {
      const entry = doc.data() as JournalEntry;
      const existing = uniqueByDate.get(entry.date);
      if (!existing || entry.createdAt < existing.createdAt) {
        uniqueByDate.set(entry.date, entry);
      }
    }

    // Return entry metadata directly — summary is stored on the entry at save time
    return Array.from(uniqueByDate.values());
  }
}
