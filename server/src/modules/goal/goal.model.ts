// src/modules/goal/goal.model.ts

export interface GoalStage {
  id: string;
  title: string;
  description?: string;
  order: number;
  completed: boolean;
}

export interface Goal {
  id: string;
  userId: string; // Owner of the goal
  title: string;
  description: string | null;
  stages: GoalStage[];
  createdAt: FirebaseFirestore.Timestamp | string; // Allow both for flexibility
}
