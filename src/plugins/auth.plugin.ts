import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { auth } from '../config/firebase';

/**
 * Authentication decorator for protecting routes
 */
const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'Missing or invalid authorization header',
        });
      }

      const token = authHeader.replace('Bearer ', '');

      const decodedToken = await auth.verifyIdToken(token);

      request.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
      };
    } catch (error) {
      fastify.log.error(error, 'Authentication failed');
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }
  });

  fastify.log.info('✅ Auth plugin registered');
};

export default fp(authPlugin, {
  name: 'auth-plugin',
});
