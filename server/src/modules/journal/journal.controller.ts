import { FastifyReply, FastifyRequest } from 'fastify';
import { JournalService } from './journal.service';
import { JournalBlock } from './journal.types';
import { AppError } from '../../shared/errors/app-error';

export class JournalController {
  // 🔹 GET journal by date (NO auto create) - SECURE
  static async getJournalByDate(
    request: FastifyRequest<{ Querystring: { date: string } }>,
    reply: FastifyReply
  ) {
    // SECURITY: Extract userId from authenticated user (JWT)
    const userId = request.user?.uid;
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { date } = request.query;
    const journal = await JournalService.getJournalByDate(date, userId);
    reply.send(journal); // null if not exists
  }

  // 🔹 CREATE entry (first save) - SECURE
  static async createJournal(
    request: FastifyRequest<{
      Body: {
        date: string;
        title?: string;
        isPinnedToTimeline?: boolean;
        blocks: JournalBlock[];
      };
    }>,
    reply: FastifyReply
  ) {
    // SECURITY: Extract userId from authenticated user (JWT)
    const userId = request.user?.uid;
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    // SECURITY: userId from JWT, NOT from request body
    const entry = await JournalService.createJournal({
      userId,
      ...request.body,
    });
    reply.send(entry);
  }

  // 🔹 UPDATE canvas only - SECURE
  static async updateCanvas(
    request: FastifyRequest<{
      Params: { entryId: string };
      Body: { blocks: JournalBlock[] };
    }>,
    reply: FastifyReply
  ) {
    // SECURITY: Extract userId from authenticated user (JWT)
    const userId = request.user?.uid;
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { entryId } = request.params;
    const { blocks } = request.body;

    try {
      await JournalService.updateCanvas(entryId, blocks, userId);
      reply.send({ success: true });
    } catch (error: any) {
      if (error.message === 'FORBIDDEN') {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You do not have permission to modify this journal entry',
        });
      }
      throw error;
    }
  }

  // 🔹 UPDATE metadata explicitly - SECURE
  static async updateMeta(
    request: FastifyRequest<{
      Params: { entryId: string };
      Body: {
        title?: string;
        isPinnedToTimeline?: boolean;
      };
    }>,
    reply: FastifyReply
  ) {
    // SECURITY: Extract userId from authenticated user (JWT)
    const userId = request.user?.uid;
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { entryId } = request.params;

    try {
      await JournalService.updateMeta(entryId, request.body, userId);
      reply.send({ success: true });
    } catch (error: any) {
      if (error.message === 'FORBIDDEN') {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You do not have permission to modify this journal entry',
        });
      }
      throw error;
    }
  }

  // 🔹 GET full journal by id - SECURE
  static async getJournal(
    request: FastifyRequest<{ Params: { entryId: string } }>,
    reply: FastifyReply
  ) {
    // SECURITY: Extract userId from authenticated user (JWT)
    const userId = request.user?.uid;
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { entryId } = request.params;

    try {
      const data = await JournalService.getFullJournal(entryId, userId);
      reply.send(data);
    } catch (error: any) {
      if (error.message === 'FORBIDDEN') {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You do not have permission to access this journal entry',
        });
      }
      throw error;
    }
  }
}
