import { FastifyPluginAsync } from 'fastify';
import { JournalController } from './journal.controller';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';

// Uploads directory at server root
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'journal-images');

const journalRoutes: FastifyPluginAsync = async (fastify) => {
  // Ensure uploads directory exists
  await mkdir(UPLOADS_DIR, { recursive: true });

  fastify.get('/', JournalController.getJournalByDate); // ?date=
  fastify.get('/range', JournalController.getJournalsByRange); // ?startDate=&endDate=
  fastify.post('/', JournalController.createJournal);
  fastify.get('/:entryId', JournalController.getJournal);
  fastify.put('/:entryId/canvas', JournalController.updateCanvas);
  fastify.patch('/:entryId/meta', JournalController.updateMeta);

  // ── Image upload ──────────────────────────────────────────────────────────
  // POST /api/v1/journal/upload-image  (multipart/form-data, field: "image")
  // Returns: { url: string }
  fastify.post('/upload-image', async (request, reply) => {
    // Collect the file from the multipart stream
    let data: any = null;
    const parts = request.parts();
    for await (const part of parts) {
      if (part.type === 'file') {
        data = part;
        break;
      }
    }

    if (!data) {
      return reply.status(400).send({ message: 'No image file received' });
    }

    const ext = (data.filename.split('.').pop() || 'jpg').toLowerCase();
    const allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic'];
    if (!allowedExts.includes(ext)) {
      return reply.status(400).send({ message: 'Invalid file type' });
    }

    const savedFilename = `${Date.now()}_${data.filename.replace(/\s+/g, '_')}`;
    const filePath = path.join(UPLOADS_DIR, savedFilename);

    try {
      const writeStream = createWriteStream(filePath);
      await pipeline(data.file, writeStream);

      // Return a relative path — the client prepends its own base URL
      // so it always resolves to the correct host/IP for the current device
      const relativePath = `/uploads/journal-images/${savedFilename}`;

      fastify.log.info({ path: relativePath }, 'Image uploaded successfully');
      return reply.send({ url: relativePath });
    } catch (err: any) {
      fastify.log.error(err, 'Local file upload failed');
      return reply.status(500).send({
        message: 'Failed to upload image',
        detail: err.message,
      });
    }
  });
};

export default journalRoutes;
