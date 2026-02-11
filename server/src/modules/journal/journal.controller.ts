import { FastifyReply, FastifyRequest } from 'fastify';
import { JournalService } from './journal.service';
import { JournalBlock } from './journal.types';

export class JournalController {
  // 🔹 GET journal by date (NO auto create)
  static async getJournalByDate(
    request: FastifyRequest<{ Querystring: { date: string } }>,
    reply: FastifyReply
  ) {
    const { date } = request.query;
    const journal = await JournalService.getJournalByDate(date);
    reply.send(journal); // null if not exists
  }

  // 🔹 CREATE entry (first save)
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
    const entry = await JournalService.createJournal(request.body);
    reply.send(entry);
  }

  // 🔹 UPDATE canvas only
  static async updateCanvas(
    request: FastifyRequest<{
      Params: { entryId: string };
      Body: { blocks: JournalBlock[] };
    }>,
    reply: FastifyReply
  ) {
    const { entryId } = request.params;
    const { blocks } = request.body;

    await JournalService.updateCanvas(entryId, blocks);
    reply.send({ success: true });
  }

  // 🔹 UPDATE metadata explicitly
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
    const { entryId } = request.params;
    await JournalService.updateMeta(entryId, request.body);
    reply.send({ success: true });
  }

  // 🔹 GET full journal by id
  static async getJournal(
    request: FastifyRequest<{ Params: { entryId: string } }>,
    reply: FastifyReply
  ) {
    const { entryId } = request.params;
    const data = await JournalService.getFullJournal(entryId);
    reply.send(data);
  }
}
