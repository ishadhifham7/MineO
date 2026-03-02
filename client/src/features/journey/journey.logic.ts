// src/features/journey/journey.logic.ts

// Points configuration for journey progress
const POINTS_CONFIG = {
  GOAL_COMPLETED: 20,
  JOURNAL_ENTRY: 2,
  HABIT_STREAK: 1,
  POINTS_PER_STAGE: 100,
};

export const calculateProgress = (goals: any[], journals: any[], habits: any) => {
  const goalPoints = goals.filter(g => g.completed).length * 20;
  const journalPoints = journals.length * 2; // All journals count
  const habitPoints = habits.maxStreak || 0;

  const totalPoints = goalPoints + journalPoints + habitPoints;
  const currentStage = Math.min(Math.floor(totalPoints / 100) + 1, 6);
  const progressPercent = (totalPoints % 100);

  return { totalPoints, currentStage, progressPercent };
};