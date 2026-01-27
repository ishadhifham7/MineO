// src/modules/ai/ai.controller.ts

import { FastifyRequest, FastifyReply } from 'fastify';
import { callAI } from './ai.service';
import { SYSTEM_PROMPT } from './ai.prompt';
import { AppError } from '../../shared/errors/app-error';
import { ChatRequestBody, AIMessage } from './ai.types';

export async function chatWithAI(
  req: FastifyRequest<{ Body: ChatRequestBody }>,
  reply: FastifyReply
) {
  try {
    const { conversation, message } = req.body;

    if (!message || message.trim().length === 0) {
      throw new AppError('Message cannot be empty', 400);
    }

    const safeConversation: AIMessage[] = Array.isArray(conversation) ? conversation : [];

    const messages: AIMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...safeConversation,
      { role: 'user', content: message.trim() },
    ];

    const aiReply: string = await callAI(messages);

    return reply.send({ message: aiReply });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    req.log.error(error, 'AI chat error');
    throw new AppError('Failed to process AI request', 500);
  }
}
