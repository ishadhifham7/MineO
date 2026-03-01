import { firestore } from '../../config/firebase'
import { JourneyNode } from './journey.types'

const JOURNAL_COLLECTION = 'journalEntries'

/**
 * Fetch all journals for a user, sorted by date ascending
 * Sorting is done in-memory to avoid requiring a composite index in Firestore
 */
export async function fetchAllJournals(
  userId: string
): Promise<JourneyNode[]> {
  const snapshot = await firestore
    .collection(JOURNAL_COLLECTION)
    .where('userId', '==', userId)
    .get()

  const journals = snapshot.docs.map((doc: any) => {
    const data = doc.data()

    return {
      id: doc.id,
      date: data.date,
      title: data.title ?? undefined,
      updatedAt: data.updatedAt,
    }
  })

  // Sort by date in memory (avoids needing composite index)
  return journals.sort((a: JourneyNode, b: JourneyNode) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateA - dateB
  })
}
