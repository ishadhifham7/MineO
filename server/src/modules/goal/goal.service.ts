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
/**
 * Get a specific goal by ID
 */
export async function getGoalById(goalId: string): Promise<Goal | null> {
  const doc = await firestore.collection('goals').doc(goalId).get();

  if (!doc.exists) {
    return null; // Goal not found
  }

  const data = doc.data();

  if (!data) return null;

  // Build the goal object with explicit ID and mapped stages
  const goal: Goal = {
    id: doc.id,
    title: data.title,
    description: data.description ?? null,
    createdAt: data.createdAt ?? null,
    stages: (data.stages || []).map((stage: any) => ({
      id: stage.id,
      title: stage.title,
      description: stage.description ?? null,
      order: stage.order,
      completed: stage.completed ?? false,
    })),
  };

  return goal;
}

export async function completeGoalStage(goalId: string, stageId: string): Promise<Goal | null> {
  const goalRef = firestore.collection('goals').doc(goalId);
  const goalSnap = await goalRef.get();

  if (!goalSnap.exists) {
    return null;
  }

  const goal = goalSnap.data() as Goal;

  let stageFound = false;

  const updatedStages: GoalStage[] = goal.stages.map((stage) => {
    if (stage.id === stageId) {
      stageFound = true;
      return {
        ...stage,
        completed: true,
      };
    }
    return stage;
  });

  if (!stageFound) {
    return null;
  }

  await goalRef.update({
    stages: updatedStages,
  });

  return {
    ...goal,
    stages: updatedStages,
  };
}

export async function deleteGoal(goalId: string) {
  const goalRef = firestore.collection('goals').doc(goalId);
  const snapshot = await goalRef.get();

  if (!snapshot.exists) {
    throw new Error('GOAL_NOT_FOUND');
  }

  await goalRef.delete();

  return goalId;
}
