// src/modules/goal/goal.controller.ts

import { FastifyRequest, FastifyReply } from 'fastify';
import { generateGoal, getGoals } from './goal.service';
import { AppError } from '../../shared/errors/app-error';

interface GenerateGoalBody {
  title: string;
  description: string;
  stages: {
    title: string;
    description?: string;
    order: number;
  }[];
}

export async function generateGoalController(
  req: FastifyRequest<{ Body: GenerateGoalBody }>,
  reply: FastifyReply
) {
  const { title, description, stages } = req.body;

  const goalId = await generateGoal({
    title,
    description,
    stages,
  });

  return reply.code(201).send({
    goalId,
    message: 'Goal created successfully',
  });
}

export async function getGoalsController(req: FastifyRequest, reply: FastifyReply) {
  const goals = await getGoals();

  return reply.code(200).send({
    goals,
    count: goals.length,
  });
}

/**export async function getGoalByIdController(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = req.params;

  const goal = await getGoalById(id);

  if (!goal) {
    throw new AppError('Goal not found', 404);
  }

  return reply.code(200).send({ goal });
}*/
