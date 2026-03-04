import { JournalRepository } from './journal.repository';
import { JournalEntry, JournalBlock, ImageBlock } from './journal.types';
import { deleteRemovedImages, deleteCanvasImages } from './journal.storage';
import { v4 as uuid } from 'uuid';

export class JournalService {
  // 🔹 get by date (NO auto create) - SECURE: filtered by userId
  static async getJournalByDate(date: string, userId: string) {
    const snap = await JournalRepository.entries()
      .where('userId', '==', userId)
      .where('date', '==', date)
      .limit(1)
      .get();

    if (snap.empty) return null;

    const entry = snap.docs[0].data() as JournalEntry;
    const blocksSnap = await JournalRepository.canvasBlocks(entry.id).get();

    return {
      ...entry,
      blocks: blocksSnap.docs.map((d: any) => d.data()),
    };
  }

  // 🔹 create entry (first save) - SECURE: userId from JWT
  static async createJournal({
    userId,
    date,
    title,
    isPinnedToTimeline = false,
    blocks,
  }: {
    userId: string; // REQUIRED: from authenticated user
    date: string;
    title?: string;
    isPinnedToTimeline?: boolean;
    blocks: JournalBlock[];
  }) {
    const now = Date.now();
    const entryId = uuid();

    const entry: JournalEntry = {
      id: entryId,
      userId, // Attach userId from JWT
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

  // 🔹 update canvas only - SECURE: ownership verified
  static async updateCanvas(entryId: string, blocks: JournalBlock[], userId: string) {
    const entryRef = JournalRepository.entryById(entryId);
    const snap = await entryRef.get();

    if (!snap.exists) throw new Error('Entry not found');

    const entry = snap.data() as JournalEntry;

    // SECURITY: Verify ownership
    if (entry.userId !== userId) {
      throw new Error('FORBIDDEN');
    }

    // Capture old image blocks BEFORE deleting from Firestore (for Storage cleanup)
    const oldBlocksSnap = await JournalRepository.canvasBlocks(entryId).get();
    const oldAllBlocks: JournalBlock[] = oldBlocksSnap.docs.map(
      (d: any) => d.data() as JournalBlock
    );
    const oldImageBlocks = oldAllBlocks.filter((b): b is ImageBlock => b.type === 'image');

    const batch = entryRef.firestore.batch();

    oldBlocksSnap.docs.forEach((doc: any) => batch.delete(doc.ref));

    blocks.forEach((block) => {
      batch.set(JournalRepository.canvasBlockById(entryId, block.id), block);
    });

    batch.update(entryRef, { updatedAt: Date.now() });
    await batch.commit();

    // Delete Storage files for image blocks that were removed
    const newImageBlocks = blocks.filter((b): b is ImageBlock => b.type === 'image');
    await deleteRemovedImages(oldImageBlocks, newImageBlocks);
  }

  // 🔹 update metadata only - SECURE: ownership verified
  static async updateMeta(
    entryId: string,
    meta: { title?: string; isPinnedToTimeline?: boolean },
    userId: string
  ) {
    const entryRef = JournalRepository.entryById(entryId);
    const snap = await entryRef.get();

    if (!snap.exists) throw new Error('Entry not found');

    const entry = snap.data() as JournalEntry;

    // SECURITY: Verify ownership
    if (entry.userId !== userId) {
      throw new Error('FORBIDDEN');
    }

    await entryRef.update({
      ...meta,
      updatedAt: Date.now(),
    });
  }

  // 🔹 get full journal by id - SECURE: ownership verified
  static async getFullJournal(entryId: string, userId: string) {
    const entryRef = JournalRepository.entryById(entryId);
    const snap = await entryRef.get();

    if (!snap.exists) {
      throw new Error('Entry not found');
    }

    const entry = snap.data() as JournalEntry;

    // SECURITY: Verify ownership
    if (entry.userId !== userId) {
      throw new Error('FORBIDDEN');
    }

    const blocksSnap = await JournalRepository.canvasBlocks(entryId).get();

    // Return flattened structure for frontend
    return {
      ...entry,
      blocks: blocksSnap.docs.map((d: any) => d.data()),
    };
  }

  // 🔹 delete journal entry + all its Storage images - SECURE: ownership verified
  static async deleteJournal(entryId: string, userId: string) {
    const entryRef = JournalRepository.entryById(entryId);
    const snap = await entryRef.get();

    if (!snap.exists) throw new Error('Entry not found');

    const entry = snap.data() as JournalEntry;

    // SECURITY: Verify ownership
    if (entry.userId !== userId) {
      throw new Error('FORBIDDEN');
    }

    // Fetch all canvas blocks to find images that need Storage cleanup
    const blocksSnap = await JournalRepository.canvasBlocks(entryId).get();
    const allBlocks: JournalBlock[] = blocksSnap.docs.map((d: any) => d.data() as JournalBlock);
    const imageBlocks = allBlocks.filter((b): b is ImageBlock => b.type === 'image');

    // Delete all canvas block docs + entry doc in one batch
    const batch = entryRef.firestore.batch();
    blocksSnap.docs.forEach((doc: any) => batch.delete(doc.ref));
    batch.delete(entryRef);
    await batch.commit();

    // Clean up Firebase Storage files (after Firestore batch succeeds)
    await deleteCanvasImages(imageBlocks);
  }
}
