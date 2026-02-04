// journal.controller.ts

import { FastifyReply, FastifyRequest } from 'fastify';
import { JournalService } from './journal.service';

export class JournalController {
  static async getDailyJournal(
    request: FastifyRequest<{ Params: { date: string } }>,
    reply: FastifyReply
  ) {
    const { date } = request.params;
    const entry = await JournalService.getOrCreateDailyEntry(date);
    reply.send(entry);
  }

  static async saveCanvas(
    request: FastifyRequest<{
      Params: { entryId: string };
      Body: { blocks: any[] };
    }>,
    reply: FastifyReply
  ) {
    const { entryId } = request.params;
    const { blocks } = request.body;

    await JournalService.saveCanvas(entryId, blocks);
    reply.send({ success: true });
  }

  static async getJournal(
    request: FastifyRequest<{ Params: { entryId: string } }>,
    reply: FastifyReply
  ) {
    const { entryId } = request.params;
    const data = await JournalService.getFullJournal(entryId);
    reply.send(data);
  }

  static async pinToTimeline(
    request: FastifyRequest<{
      Params: { entryId: string };
      Body: { value: boolean };
    }>,
    reply: FastifyReply
  ) {
    const { entryId } = request.params;
    const { value } = request.body;

    await JournalService.toggleTimelinePin(entryId, value);
    reply.send({ success: true });
  }
}
