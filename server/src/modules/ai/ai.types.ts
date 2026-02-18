// src/modules/ai/ai.types.ts

export type AIMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export interface ChatRequestBody {
  conversation: AIMessage[];
  message: string;
}

export interface DraftStage {
  title: string;
  description: string;
  order: number;
}

export interface DraftGoal {
  title: string;
  description: string;
  stages: DraftStage[];
}

export interface ChatResponse {
  message: string;
  draftGoal: DraftGoal | null;
}
