import { fetchPinnedJournals } from './journey.repository'
import { JourneyNode } from './journey.types'

export async function getJourneyTimeline(
  userId: string
): Promise<JourneyNode[]> {
  return fetchPinnedJournals(userId)
}
