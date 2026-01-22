// src/modules/goal/goal.routes.ts

import { FastifyPluginAsync } from 'fastify';
import { generateGoalController, getGoalsController } from './goal.controller';
import { generateGoalSchema, getUserGoalsSchema, getGoalByIdSchema } from './goal.schema';

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
  /**fastify.get('/:id', {
    schema: getGoalByIdSchema,
    handler: getGoalByIdController,
  });*/
};

export default goalRoutes;
