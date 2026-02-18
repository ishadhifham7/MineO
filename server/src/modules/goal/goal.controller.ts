// src/modules/goal/goal.controller.ts

import { FastifyRequest, FastifyReply } from 'fastify';
import { generateGoal, getGoals, deleteGoal, getGoalById } from './goal.service';
import { AppError } from '../../shared/errors/app-error';
import { completeGoalStage } from './goal.service';
import { firestore } from '../../config/firebase';

interface GenerateGoalBody {
  title: string;
  description: string;
  stages: {
    title: string;
    description: string;
    order: number;
  }[];
}

interface DeleteGoalRequest {
  Params: {
    goalId: string;
  };
}

export async function generateGoalController(
  req: FastifyRequest<{ Body: GenerateGoalBody }>,
  reply: FastifyReply
) {
  const { title, description, stages } = req.body;

  // Validate input
  if (!title || title.trim().length === 0) {
    throw new AppError('Title cannot be empty', 400);
  }

  if (!description || description.trim().length === 0) {
    throw new AppError('Description cannot be empty', 400);
  }

  if (!stages || stages.length === 0) {
    throw new AppError('At least one stage is required', 400);
  }

  // Validate each stage
  stages.forEach((stage, index) => {
    if (!stage.title || stage.title.trim().length === 0) {
      throw new AppError(`Stage ${index + 1} title cannot be empty`, 400);
    }
    if (!stage.description || stage.description.trim().length === 0) {
      throw new AppError(`Stage ${index + 1} description cannot be empty`, 400);
    }
    if (typeof stage.order !== 'number') {
      throw new AppError(`Stage ${index + 1} order must be a number`, 400);
    }
  });

  const createdGoal = await generateGoal({
    title,
    description,
    stages,
  });

  return reply.code(201).send(createdGoal);
}

export async function getGoalsController(req: FastifyRequest, reply: FastifyReply) {
  const goals = await getGoals();

  return reply.code(200).send({
    goals,
    count: goals.length,
  });
}

export async function getGoalByIdController(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = req.params;

  const goal = await getGoalById(id);

  if (!goal) {
    return reply.code(404).send({
      error: 'Not Found',
      message: 'Goal not found',
    });
  }

  return reply.code(200).send({ goal });
}

export async function completeGoalStageController(
  req: FastifyRequest<{
    Params: {
      goalId: string;
      stageId: string;
    };
  }>,
  reply: FastifyReply
) {
  const { goalId, stageId } = req.params;

  const updatedGoal = await completeGoalStage(goalId, stageId);

  if (!updatedGoal) {
    throw new AppError('Goal or stage not found', 404);
  }

  return reply.code(200).send({
    message: 'Stage marked as completed',
    goal: updatedGoal,
  });
}

export async function deleteGoalController(
  request: FastifyRequest<DeleteGoalRequest>,
  reply: FastifyReply
) {
  const { goalId } = request.params;

  try {
    await deleteGoal(goalId);

    return reply.status(200).send({
      message: 'Goal deleted successfully',
      goalId,
    });
  } catch (error: any) {
    if (error.message === 'GOAL_NOT_FOUND') {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Goal not found',
      });
    }

    throw error;
  }
}
