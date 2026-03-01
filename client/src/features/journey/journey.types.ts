export type JourneyNodePosition = {
  id: string;
  x: number;
  y: number;
};

export type Milestone = {
  id: number;
  title: string;
  description: string;
  unlockedAt?: string;
};

export type JourneyState = {
  currentStage: number;
  unlockedStages: number[];
  progressPercent: number;
  totalPoints: number;
  milestones: Milestone[];
};