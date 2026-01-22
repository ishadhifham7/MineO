import { FastifyInstance } from 'fastify';

// Import module routes when ready
// import authRoutes from './modules/auth/auth.routes';
// import userRoutes from './modules/user/user.routes';
// import journalRoutes from './modules/journal/journal.routes';
// import momentRoutes from './modules/moment/moment.routes';
// import habitRoutes from './modules/habit/habit.routes';
// import goalRoutes from './modules/goal/goal.routes';

/**
 * Register all application routes
 */
export async function registerRoutes(app: FastifyInstance) {
  // Register API v1 routes
  await app.register(
    async (apiV1) => {
      // Uncomment and register routes as modules are completed
      // await apiV1.register(authRoutes, { prefix: '/auth' });
      // await apiV1.register(userRoutes, { prefix: '/users' });
      // await apiV1.register(journalRoutes, { prefix: '/journals' });
      // await apiV1.register(momentRoutes, { prefix: '/moments' });
      // await apiV1.register(habitRoutes, { prefix: '/habits' });
      // await apiV1.register(goalRoutes, { prefix: '/goals' });

      // Placeholder route for testing
      apiV1.get('/', async () => ({
        message: 'MineO API v1',
        version: '1.0.0',
      }));
    },
    { prefix: '/api/v1' }
  );

  app.log.info('✅ Routes registered');
}
