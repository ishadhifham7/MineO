import Fastify from 'fastify';
import cors from '@fastify/cors';

import firebasePlugin from './plugins/firebase.plugin';
import authPlugin from './plugins/auth.plugin';
import zodPlugin from './plugins/zod.plugin';
import swaggerPlugin from './plugins/swagger.plugin';

import { errorHandler } from './shared/errors/error-handler';
import { registerRoutes } from './routes';
import { env } from './config/env';

function parseAllowedOrigins(rawOrigins: string): string[] {
  return rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

/**
 * Build and configure the Fastify application
 */
export async function buildApp() {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === 'production' ? 'info' : 'debug',
      transport:
        env.NODE_ENV === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
    },
  });

  const allowedOrigins = parseAllowedOrigins(env.CORS_ORIGIN);

  // Register CORS
  await app.register(cors, {
    origin: (origin, callback) => {
      // Allow non-browser clients (no Origin header): mobile app/native clients, curl, server-to-server.
      if (!origin) {
        callback(null, true);
        return;
      }

      // Keep local DX simple if no explicit allowlist is configured outside production.
      if (env.NODE_ENV !== 'production' && allowedOrigins.length === 0) {
        callback(null, true);
        return;
      }

      callback(null, allowedOrigins.includes(origin));
    },
    credentials: true,
  });

  // Register core plugins
  await app.register(firebasePlugin);
  await app.register(authPlugin);
  await app.register(zodPlugin);

  // Register Swagger (only in development)
  if (env.NODE_ENV === 'development') {
    await app.register(swaggerPlugin);
  }

  // Health check route
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  }));

  // Register application routes
  await registerRoutes(app);

  // Set error handler (must be after routes)
  app.setErrorHandler(errorHandler);

  return app;
}
