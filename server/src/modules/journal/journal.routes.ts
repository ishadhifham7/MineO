// journal.routes.ts

import { FastifyPluginAsync } from 'fastify';
import { JournalController } from './journal.controller';

const journalRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/daily/:date', JournalController.getDailyJournal);
  fastify.get('/:entryId', JournalController.getJournal);
  fastify.put('/:entryId/canvas', JournalController.saveCanvas);
  fastify.put('/:entryId/pin', JournalController.pinToTimeline);
};

export default journalRoutes;
