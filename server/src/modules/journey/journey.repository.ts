import { firestore } from '../../config/firebase'
import { JourneyNode } from './journey.types'

const JOURNAL_COLLECTION = 'journals'

export async function fetchPinnedJournals(
  userId: string
): Promise<JourneyNode[]> {
  const snapshot = await firestore
    .collection(JOURNAL_COLLECTION)
    .where('userId', '==', userId)
    .where('isPinnedToTimeline', '==', true)
    .orderBy('date', 'asc')
    .get()

  return snapshot.docs.map(doc => {
    const data = doc.data()

    return {
      id: doc.id,
      date: data.date,
      title: data.title ?? undefined,
      isPinnedToTimeline: data.isPinnedToTimeline,
      updatedAt: data.updatedAt,
    }
  })
}
