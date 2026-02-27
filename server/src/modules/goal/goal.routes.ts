// src/modules/goal/goal.routes.ts

import { FastifyPluginAsync } from 'fastify';
import {
  generateGoalController,
  getGoalsController,
  getGoalByIdController,
  deleteGoalController,
  toggleGoalStageController,
} from './goal.controller';
import {
  generateGoalSchema,
  getUserGoalsSchema,
  getGoalByIdSchema,
  deleteGoalSchema,
  toggleStageCompletionSchema,
} from './goal.schema';

const goalRoutes: FastifyPluginAsync = async (fastify) => {
  // SECURITY: All goal routes require authentication

  // Generate a new goal
  fastify.post('/generate', {
    preHandler: [fastify.authenticate],
    schema: generateGoalSchema,
    handler: generateGoalController,
  });

  // Get all goals (user-specific)
  fastify.get('/', {
    preHandler: [fastify.authenticate],
    schema: getUserGoalsSchema,
    handler: getGoalsController,
  });

  // Get a specific goal by ID (ownership verified)
  fastify.get('/:id', {
    preHandler: [fastify.authenticate],
    schema: getGoalByIdSchema,
    handler: getGoalByIdController,
  });

  // Toggle stage completion status (ownership verified)
  fastify.patch('/:goalId/stages/:stageId', {
    preHandler: [fastify.authenticate],
    schema: toggleStageCompletionSchema,
    handler: toggleGoalStageController,
  });

  // Delete a goal (ownership verified)
  fastify.delete('/:goalId', {
    preHandler: [fastify.authenticate],
    schema: deleteGoalSchema,
    handler: deleteGoalController,
  });
};

export default goalRoutes;
