// src/modules/goal/goal.service.ts

import { firestore, Timestamp } from '../../config/firebase';
import { Goal, GoalStage } from './goal.model';
import { randomUUID } from 'crypto';

interface GenerateGoalInput {
  userId: string; // REQUIRED: from authenticated user
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
    userId: data.userId, // Attach userId from JWT
    title: data.title,
    description: data.description,
    stages,
    createdAt: Timestamp.now(),
  };

  await firestore.collection('goals').doc(goalId).set(goal);

  // Return the created goal with createdAt as ISO string for frontend
  return {
    id: goal.id,
    userId: goal.userId,
    title: goal.title,
    description: goal.description,
    createdAt:
      typeof goal.createdAt === 'string' ? goal.createdAt : goal.createdAt.toDate().toISOString(),
    stages: goal.stages,
  };
}

// SECURE: Get goals filtered by authenticated user
export async function getGoals(userId: string): Promise<any[]> {
  const snapshot = await firestore
    .collection('goals')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

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
      userId: data.userId,
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
 * Get a specific goal by ID (with ownership verification)
 */
export async function getGoalById(goalId: string, userId: string): Promise<any | null> {
  const doc = await firestore.collection('goals').doc(goalId).get();

  if (!doc.exists) {
    return null;
  }

  const data = doc.data();

  if (!data) return null;

  // SECURITY: Verify ownership
  if (data.userId !== userId) {
    throw new Error('FORBIDDEN');
  }

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
    userId: data.userId,
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
 * Toggle a stage's completion status (with ownership verification)
 * @param goalId - The goal ID
 * @param stageId - The stage ID
 * @param completed - The new completion status (true/false)
 * @param userId - The authenticated user ID
 */
export async function toggleGoalStageCompletion(
  goalId: string,
  stageId: string,
  completed: boolean,
  userId: string
): Promise<any | null> {
  const goalRef = firestore.collection('goals').doc(goalId);
  const goalSnap = await goalRef.get();

  if (!goalSnap.exists) {
    return null;
  }

  const data = goalSnap.data();
  if (!data) return null;

  // SECURITY: Verify ownership
  if (data.userId !== userId) {
    throw new Error('FORBIDDEN');
  }

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
    userId: data.userId,
    title: data.title,
    description: data.description ?? null,
    createdAt: createdAtString,
    stages: updatedStages,
  };

  return JSON.parse(JSON.stringify(updatedGoal));
}

export async function deleteGoal(goalId: string, userId: string) {
  const goalRef = firestore.collection('goals').doc(goalId);
  const snapshot = await goalRef.get();

  if (!snapshot.exists) {
    throw new Error('GOAL_NOT_FOUND');
  }

  const data = snapshot.data();

  // SECURITY: Verify ownership
  if (data && data.userId !== userId) {
    throw new Error('FORBIDDEN');
  }

  await goalRef.delete();

  return goalId;
}
