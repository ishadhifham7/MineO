import { FastifyPluginAsync } from 'fastify';
import { JournalController } from './journal.controller';

const journalRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', JournalController.getJournalByDate); // ?date=
  fastify.get('/range', JournalController.getJournalsByRange); // ?startDate=&endDate=
  fastify.post('/', JournalController.createJournal);
  fastify.get('/:entryId', JournalController.getJournal);
  fastify.put('/:entryId/canvas', JournalController.updateCanvas);
  fastify.patch('/:entryId/meta', JournalController.updateMeta);
};

export default journalRoutes;
