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
  // Generate a new goal
  fastify.post('/generate', {
    schema: generateGoalSchema,
    handler: generateGoalController,
  });

  // Get all goals
  fastify.get('/', {
    schema: getUserGoalsSchema,
    handler: getGoalsController,
  });

  // Get a specific goal by ID
  fastify.get('/:id', {
    schema: getGoalByIdSchema,
    handler: getGoalByIdController,
  });

  // Toggle stage completion status
  fastify.patch('/:goalId/stages/:stageId', {
    schema: toggleStageCompletionSchema,
    handler: toggleGoalStageController,
  });

  // Delete a goal
  fastify.delete('/:goalId', {
    schema: deleteGoalSchema,
    handler: deleteGoalController,
  });
};

export default goalRoutes;
