import { fetchAllJournals } from './journey.repository'
import { JourneyNode } from './journey.types'

export async function getJourneyTimeline(
  userId: string
): Promise<JourneyNode[]> {
  return fetchAllJournals(userId)
}
