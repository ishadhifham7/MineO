// journal.repository.ts

import { firestore } from '../../config/firebase';

const JOURNAL_COLLECTION = 'journalEntries';

export const JournalRepository = {
  entries: () => firestore.collection(JOURNAL_COLLECTION),

  entryById: (entryId: string) => firestore.collection(JOURNAL_COLLECTION).doc(entryId),

  canvasBlocks: (entryId: string) =>
    firestore.collection(JOURNAL_COLLECTION).doc(entryId).collection('canvasBlocks'),

  canvasBlockById: (entryId: string, blockId: string) =>
    firestore.collection(JOURNAL_COLLECTION).doc(entryId).collection('canvasBlocks').doc(blockId),
};
