import { FastifyPluginAsync } from 'fastify';
import multipart from '@fastify/multipart';
import { AuthenticatedRequest } from '../../plugins/auth.plugin';
import { getMyProfile, patchMyProfile, uploadProfilePhoto } from './user.service';
import { UpdateUserProfileBody } from './user.types';

const userRoutes: FastifyPluginAsync = async (fastify) => {
  // Register multipart plugin scoped to user routes
  await fastify.register(multipart, {
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max for profile photos
  });

  fastify.get('/me', { preHandler: fastify.authenticate }, async (request, reply) => {
    const uid = (request as AuthenticatedRequest).user?.uid;
    if (!uid) return reply.status(401).send({ error: 'Unauthorized' });

    try {
      const profile = await getMyProfile(fastify, uid);
      return reply.send({ profile });
    } catch (e: any) {
      if (e?.message === 'PROFILE_NOT_FOUND') {
        return reply.status(404).send({ error: 'Profile not found' });
      }
      request.log.error(e);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.patch('/me', { preHandler: fastify.authenticate }, async (request, reply) => {
    const uid = (request as AuthenticatedRequest).user?.uid;
    if (!uid) return reply.status(401).send({ error: 'Unauthorized' });

    const body = request.body as UpdateUserProfileBody;

    try {
      const profile = await patchMyProfile(fastify, uid, body);
      return reply.send({ profile });
    } catch (e: any) {
      if (e?.message === 'PROFILE_NOT_FOUND') {
        return reply.status(404).send({ error: 'Profile not found' });
      }
      request.log.error(e);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Upload profile photo → Firebase Storage → returns { photoUrl }
  fastify.post('/upload-photo', { preHandler: fastify.authenticate }, async (request, reply) => {
    const uid = (request as AuthenticatedRequest).user?.uid;
    if (!uid) return reply.status(401).send({ error: 'Unauthorized' });

    const data = await (request as any).file();
    if (!data) return reply.status(400).send({ error: 'No file uploaded' });

    const mimeType: string = data.mimetype || 'image/jpeg';
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(mimeType)) {
      return reply.status(415).send({ error: 'Unsupported image type' });
    }

    const chunks: Buffer[] = [];
    for await (const chunk of data.file) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    try {
      const { photoUrl } = await uploadProfilePhoto(fastify, uid, buffer, mimeType);
      return reply.send({ photoUrl });
    } catch (e: any) {
      if (e?.message === 'STORAGE_NOT_CONFIGURED') {
        return reply.status(503).send({ error: 'Storage not configured' });
      }
      if (e?.message === 'PROFILE_NOT_FOUND') {
        return reply.status(404).send({ error: 'Profile not found' });
      }
      request.log.error(e);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
};

export default userRoutes;
