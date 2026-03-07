// src/features/journey/journey.selectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { JourneyState } from './journey.types';

// Temporary RootState type until store is fully configured
type RootState = {
  journey: JourneyState;
  journal?: { items: any[] }; // Optional until journal slice is implemented
  // Add other slices as needed
};

// Basic selector to get the journey slice
export const selectJourneyState = (state: RootState): JourneyState => state.journey;

/**
 * Selects the current active stage number (1-6)
 */
export const selectCurrentStage = createSelector(
  [selectJourneyState],
  (journey) => journey.currentStage
);

/**
 * Selects an array of stage IDs that have been unlocked
 */
export const selectUnlockedStages = createSelector(
  [selectJourneyState],
  (journey) => journey.unlockedStages
);

/**
 * Selects the overall progress percentage (0-100)
 */
export const selectProgressPercent = createSelector(
  [selectJourneyState],
  (journey) => journey.progressPercent
);

/**
 * Selects all milestones reached so far
 */
export const selectMilestones = createSelector(
  [selectJourneyState],
  (journey) => journey.milestones
);

/**
 * Combined Selector: Get status for all stages at once
 * This is useful for rendering the StageNodes efficiently.
 */
export const selectStageStatuses = createSelector(
  [selectCurrentStage, selectUnlockedStages],
  (currentStage, unlockedStages) => {
    return Array.from({ length: 6 }).map((_, i) => {
      const stageId = i + 1;
      const isUnlocked = unlockedStages.includes(stageId);
      
      let status: 'locked' | 'current' | 'completed' = 'locked';
      if (stageId === currentStage) {
        status = 'current';
      } else if (isUnlocked && stageId < currentStage) {
        status = 'completed';
      }
      
      return { stageId, status };
    });
  }
);

/**
 * Integration Selector: Get all journal entries
 * This is used for the "display all journals" requirement on the map.
 * Assumes you have a journal slice in your Redux store.
 */
export const selectAllJournalsForJourney = (state: RootState) => state.journal?.items || [];