// src/modules/ai/ai.types.ts

export type AIMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export interface ChatRequestBody {
  conversation: AIMessage[];
  message: string;
}

export interface AIStage {
  title: string;
  description: string;
  order: number;
}
