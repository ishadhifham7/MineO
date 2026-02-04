// src/routes/index.ts
import { FastifyInstance } from 'fastify';

// Import module routes when ready
// import authRoutes from '../modules/auth/auth.routes';
// import userRoutes from '../modules/user/user.routes';
import aiRoutes from './modules/ai/ai.routes';
import goalRoutes from './modules/goal/goal.routes';
import journalRoutes from './modules/journal/journal.routes';
// import momentRoutes from '../modules/moment/moment.routes';
import { habitRoutes } from './modules/habit/habit.routes';

/**
 * Register all application routes
 *
 * - Modular structure for each feature
 * - Versioned API prefix (/api/v1)
 * - Placeholder health check
 */
export async function registerRoutes(app: FastifyInstance) {
  // API v1 namespace
  await app.register(
    async (app: FastifyInstance) => {
      // Uncomment and register modules as they become ready
      // await app.register(authRoutes, { prefix: '/auth' });
      // await app.register(userRoutes, { prefix: '/users' });
      await app.register(aiRoutes, { prefix: '/ai' });
      await app.register(goalRoutes, { prefix: '/goals' });
      await app.register(journalRoutes, { prefix: '/journal' });
      // await app.register(momentRoutes, { prefix: '/moments' });
      await app.register(habitRoutes, { prefix: '/habits' });
      // Root test / placeholder endpoint
      app.get('/', async () => ({
        message: 'MineO API v1 is running!',
        version: '1.0.0',
      }));

      // Optional: health check endpoint
      app.get('/health', async () => ({
        status: 'ok',
        timestamp: new Date().toISOString(),
      }));
    },
    { prefix: '/api/v1' }
  );

  app.log.info('✅ All routes registered successfully');
}
