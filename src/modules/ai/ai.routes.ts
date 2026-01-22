// src/modules/ai/ai.routes.ts

import { FastifyPluginAsync } from 'fastify';
import { chatWithAI } from './ai.controller';

const aiRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/chat', {
    schema: {
      description: 'Chat with AI assistant',
      tags: ['AI'],
      body: {
        type: 'object',
        required: ['conversation', 'message'],
        properties: {
          conversation: {
            type: 'array',
            items: {
              type: 'object',
              required: ['role', 'content'],
              properties: {
                role: { type: 'string', enum: ['system', 'user', 'assistant'] },
                content: { type: 'string' },
              },
            },
          },
          message: { type: 'string', minLength: 1 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    handler: chatWithAI,
  });
};

export default aiRoutes;
