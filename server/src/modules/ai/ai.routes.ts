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
          required: ['message'],
          properties: {
            message: { type: 'string' },
            draftGoal: {
              type: 'object',
              nullable: true,
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                stages: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['title', 'description', 'order'],
                    properties: {
                      title: { type: 'string' },
                      description: { type: 'string' },
                      order: { type: 'number' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    handler: chatWithAI,
  });
};

export default aiRoutes;
