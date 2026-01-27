import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { firestore, auth } from '../config/firebase';

/**
 * Firebase plugin - injects Firestore and Auth into Fastify instance
 */
const firebasePlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('firestore', firestore);
  fastify.decorate('firebaseAuth', auth);

  fastify.log.info('✅ Firebase plugin registered');
};

export default fp(firebasePlugin, {
  name: 'firebase-plugin',
});
