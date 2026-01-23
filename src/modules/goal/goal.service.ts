// src/modules/goal/goal.service.ts

import { firestore, Timestamp } from '../../config/firebase';
import { Goal, GoalStage } from './goal.model';
import { randomUUID } from 'crypto';

interface GenerateGoalInput {
  title: string;
  description: string;
  stages: {
    title: string;
    description?: string;
    order: number;
  }[];
}

export async function generateGoal(data: GenerateGoalInput) {
  const goalId = randomUUID();

  const stages: GoalStage[] = data.stages.map((stage) => ({
    id: randomUUID(),
    title: stage.title,
    description: stage.description,
    order: stage.order,
    completed: false,
  }));

  const goal: Goal = {
    id: goalId,
    title: data.title,
    description: data.description ?? null,
    stages,
    createdAt: Timestamp.now(),
  };

  await firestore.collection('goals').doc(goalId).set(goal);

  return goalId;
}

// ...existing code...
export async function getGoals(): Promise<Goal[]> {
  const snapshot = await firestore.collection('goals').orderBy('createdAt', 'desc').get();

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    // Build the goal object with explicit ID from Firestore document ID
    const goal: Goal = {
      id: doc.id, // Use Firestore document ID as the goal ID
      title: data.title,
      description: data.description,
      createdAt: data.createdAt,
      stages: (data.stages || []).map((stage: any) => ({
        id: stage.id, // Preserve stage ID from stored data
        title: stage.title,
        description: stage.description,
        order: stage.order,
        completed: stage.completed,
      })),
    };

    return goal;
  });
}
// ...existing code...

/**
 * Get a specific goal by ID
 * @param goalId - The goal ID
 * @returns The goal if found, null otherwise
 */
/**export async function getGoalById(goalId: string): Promise<Goal | null> {
  const doc = await firestore.collection('goals').doc(goalId).get();

  if (!doc.exists) {
    return null;
  }

  return doc.data() as Goal;
}*/
