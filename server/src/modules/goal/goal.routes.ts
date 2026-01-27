// src/modules/goal/goal.routes.ts

import { FastifyPluginAsync } from 'fastify';
import {
  generateGoalController,
  getGoalsController,
  getGoalByIdController,
  deleteGoalController,
} from './goal.controller';
import {
  generateGoalSchema,
  getUserGoalsSchema,
  getGoalByIdSchema,
  deleteGoalSchema,
} from './goal.schema';
import { completeGoalStageController } from './goal.controller';

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

  // Complete a goal stage

  fastify.delete('/:goalId', {
    schema: deleteGoalSchema,
    handler: deleteGoalController,
  });
};

export default goalRoutes;
