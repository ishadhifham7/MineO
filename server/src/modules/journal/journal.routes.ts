import { FastifyPluginAsync } from 'fastify';
import { JournalController } from './journal.controller';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';

// Uploads directory at server root
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'journal-images');

const journalRoutes: FastifyPluginAsync = async (fastify) => {
  // SECURITY: All journal routes require authentication

  // Get journal by date (user-specific)
  fastify.get('/', {
    preHandler: [fastify.authenticate],
    handler: JournalController.getJournalByDate,
  }); // ?date=

  // Create journal entry (userId from JWT)
  fastify.post('/', {
    preHandler: [fastify.authenticate],
    handler: JournalController.createJournal,
  });

  // Get ALL journal entries with blocks (user-specific) — used for search
  fastify.get('/all', {
    preHandler: [fastify.authenticate],
    handler: JournalController.getAllJournals,
  });

  // Get all dates with journal entries (user-specific)
  fastify.get('/dates', {
    preHandler: [fastify.authenticate],
    handler: JournalController.getJournalDates,
  });

  // Get ALL journal entries for a specific date (user-specific, with blocks)
  fastify.get('/all-by-date', {
    preHandler: [fastify.authenticate],
    handler: JournalController.getJournalsByDate,
  });

  // Get journal by ID (ownership verified)
  fastify.get('/:entryId', {
    preHandler: [fastify.authenticate],
    handler: JournalController.getJournal,
  });

  // Update canvas (ownership verified)
  fastify.put('/:entryId/canvas', {
    preHandler: [fastify.authenticate],
    handler: JournalController.updateCanvas,
  });

  // Update metadata (ownership verified)
  fastify.patch('/:entryId/meta', {
    preHandler: [fastify.authenticate],
    handler: JournalController.updateMeta,
  });
};

export default journalRoutes;
