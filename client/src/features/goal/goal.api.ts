import httpClient from "../../lib/http";
import { Goal } from "./goal.context";

/**
 * Fetch all goals for the authenticated user
 */
export const fetchGoalsApi = async (): Promise<Goal[]> => {
  const response = await httpClient.get("/goals");
  return response.data.goals; // Backend returns { goals: [...], count: number }
};

/**
 * Generate a new goal using AI
 */
export const generateGoalApi = async (
  goalDescription: string,
): Promise<Goal> => {
  const response = await httpClient.post("/goals/generate", {
    goalDescription,
  });
  return response.data;
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
