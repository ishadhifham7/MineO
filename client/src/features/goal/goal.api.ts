import httpClient from "../../lib/http";
import { DraftGoal, Goal } from "./goal.context";

/**
 * Fetch all goals for the authenticated user
 */
export const fetchGoalsApi = async (): Promise<Goal[]> => {
  const response = await httpClient.get("/goals");
  return response.data.goals; // Backend returns { goals: [...], count: number }
};

/**
 * Generate a new goal using the current draft
 */
export const generateGoalApi = async (draft: DraftGoal): Promise<Goal> => {
  const response = await httpClient.post("/goals/generate", draft);
  return response.data; // Backend returns the created Goal object
};

/**
 * Get a specific goal by ID
 */
export const getGoalByIdApi = async (id: string): Promise<Goal> => {
  const response = await httpClient.get(`/goals/${id}`);
  return response.data;
};

/**
 * Delete a goal
 */
export const deleteGoalApi = async (goalId: string): Promise<void> => {
  await httpClient.delete(`/goals/${goalId}`);
};

/**
 * Toggle a stage's completion status
 */
export const toggleStageCompletionApi = async (
  goalId: string,
  stageId: string,
  completed: boolean,
): Promise<Goal> => {
  const response = await httpClient.patch(
    `/goals/${goalId}/stages/${stageId}`,
    { completed },
  );
  return response.data.goal;
};
