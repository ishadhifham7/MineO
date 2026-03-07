import { FastifyPluginAsync } from 'fastify';
import { JournalController } from './journal.controller';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';

// Uploads directory at server root
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'journal-images');

const journalRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', JournalController.getJournalByDate); // ?date=
  fastify.post('/', JournalController.createJournal);
  fastify.get('/:entryId', JournalController.getJournal);
  fastify.put('/:entryId/canvas', JournalController.updateCanvas);
  fastify.patch('/:entryId/meta', JournalController.updateMeta);
};

export default journalRoutes;
