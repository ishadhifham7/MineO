// src/modules/goal/goal.service.ts

import { firestore, Timestamp } from '../../config/firebase';
import { Goal, GoalStage } from './goal.model';
import { randomUUID } from 'crypto';

interface GenerateGoalInput {
  title: string;
  description: string;
  stages: {
    title: string;
    description: string;
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
    description: data.description,
    stages,
    createdAt: Timestamp.now(),
  };

  await firestore.collection('goals').doc(goalId).set(goal);

  // Return the created goal with createdAt as ISO string for frontend
  return {
    id: goal.id,
    title: goal.title,
    description: goal.description,
    createdAt:
      typeof goal.createdAt === 'string' ? goal.createdAt : goal.createdAt.toDate().toISOString(),
    stages: goal.stages,
  };
}

// ...existing code...
export async function getGoals(): Promise<any[]> {
  const snapshot = await firestore.collection('goals').orderBy('createdAt', 'desc').get();

  if (snapshot.empty) {
    return [];
  }

  const goals = snapshot.docs.map((doc) => {
    const data = doc.data();

    // Convert Firestore Timestamp to ISO string
    let createdAtString: string;
    if (!data.createdAt) {
      createdAtString = new Date().toISOString();
    } else if (typeof data.createdAt === 'object' && data.createdAt._seconds) {
      createdAtString = new Date(data.createdAt._seconds * 1000).toISOString();
    } else if (typeof data.createdAt.toDate === 'function') {
      createdAtString = data.createdAt.toDate().toISOString();
    } else if (typeof data.createdAt === 'string') {
      createdAtString = data.createdAt;
    } else {
      createdAtString = new Date().toISOString();
    }

    // Return a plain object (not typed as Goal) to ensure proper serialization
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      createdAt: createdAtString,
      stages: (data.stages || []).map((stage: any) => ({
        id: stage.id,
        title: stage.title,
        description: stage.description,
        order: stage.order,
        completed: stage.completed,
      })),
    };
  });

  // Force clean serialization to remove any Firestore Timestamp objects
  return JSON.parse(JSON.stringify(goals));
}
/**
 * Get a specific goal by ID
 */
export async function getGoalById(goalId: string): Promise<any | null> {
  const doc = await firestore.collection('goals').doc(goalId).get();

  if (!doc.exists) {
    return null;
  }

  const data = doc.data();

  if (!data) return null;

  // Convert Firestore Timestamp to ISO string
  let createdAtString: string;
  if (!data.createdAt) {
    createdAtString = new Date().toISOString();
  } else if (typeof data.createdAt === 'object' && data.createdAt._seconds) {
    createdAtString = new Date(data.createdAt._seconds * 1000).toISOString();
  } else if (typeof data.createdAt.toDate === 'function') {
    createdAtString = data.createdAt.toDate().toISOString();
  } else if (typeof data.createdAt === 'string') {
    createdAtString = data.createdAt;
  } else {
    createdAtString = new Date().toISOString();
  }

  // Return plain object for proper serialization
  const goal = {
    id: doc.id,
    title: data.title,
    description: data.description ?? null,
    createdAt: createdAtString,
    stages: (data.stages || []).map((stage: any) => ({
      id: stage.id,
      title: stage.title,
      description: stage.description ?? null,
      order: stage.order,
      completed: stage.completed ?? false,
    })),
  };

  // Force clean serialization
  return JSON.parse(JSON.stringify(goal));
}

/**
 * Toggle a stage's completion status
 * @param goalId - The goal ID
 * @param stageId - The stage ID
 * @param completed - The new completion status (true/false)
 */
export async function toggleGoalStageCompletion(
  goalId: string,
  stageId: string,
  completed: boolean
): Promise<any | null> {
  const goalRef = firestore.collection('goals').doc(goalId);
  const goalSnap = await goalRef.get();

  if (!goalSnap.exists) {
    return null;
  }

  const data = goalSnap.data();
  if (!data) return null;

  let stageFound = false;

  const updatedStages: GoalStage[] = data.stages.map((stage: GoalStage) => {
    if (stage.id === stageId) {
      stageFound = true;
      return {
        ...stage,
        completed,
      };
    }
    return stage;
  });

  if (!stageFound) {
    return null;
  }

  // Update in Firestore
  await goalRef.update({
    stages: updatedStages,
  });

  // Convert Firestore Timestamp to ISO string for response
  let createdAtString: string;
  if (!data.createdAt) {
    createdAtString = new Date().toISOString();
  } else if (typeof data.createdAt === 'object' && data.createdAt._seconds) {
    createdAtString = new Date(data.createdAt._seconds * 1000).toISOString();
  } else if (typeof data.createdAt.toDate === 'function') {
    createdAtString = data.createdAt.toDate().toISOString();
  } else if (typeof data.createdAt === 'string') {
    createdAtString = data.createdAt;
  } else {
    createdAtString = new Date().toISOString();
  }

  // Return updated goal
  const updatedGoal = {
    id: goalSnap.id,
    title: data.title,
    description: data.description ?? null,
    createdAt: createdAtString,
    stages: updatedStages,
  };

  return JSON.parse(JSON.stringify(updatedGoal));
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
