// src/modules/ai/ai.service.ts

import Groq from 'groq-sdk';
import { AIMessage } from './ai.types';
import { AppError } from '../../shared/errors/app-error';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function callAI(messages: AIMessage[]): Promise<string> {
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant', // Free-tier model
      messages,
      temperature: 0.7,
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new AppError('AI returned empty response', 500);
    }

    return response.choices[0].message.content;
  } catch (error) {
    console.error('callAI error:', error);
    throw new AppError('Failed to call AI service', 500);
  }
}
