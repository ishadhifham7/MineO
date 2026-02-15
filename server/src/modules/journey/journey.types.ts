export interface JourneyNode {
  id: string
  date: string           // yyyy-mm-dd
  title?: string
  isPinnedToTimeline: boolean
  updatedAt: number
}
