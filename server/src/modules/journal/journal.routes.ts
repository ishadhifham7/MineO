import { FastifyPluginAsync } from 'fastify';
import multipart from '@fastify/multipart';
import { JournalController } from './journal.controller';

const journalRoutes: FastifyPluginAsync = async (fastify) => {
  // Register multipart plugin scoped to journal routes
  await fastify.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB max upload
    },
  });

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

  // Upload image for a canvas block (returns { imageUrl, imagePath })
  fastify.post('/upload-image', {
    preHandler: [fastify.authenticate],
    handler: JournalController.uploadImage,
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

  // Delete journal entry + all its images (ownership verified)
  fastify.delete('/:entryId', {
    preHandler: [fastify.authenticate],
    handler: JournalController.deleteJournal,
  });
};

export default journalRoutes;
