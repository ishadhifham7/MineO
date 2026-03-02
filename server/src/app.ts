import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';

import firebasePlugin from './plugins/firebase.plugin';
import authPlugin from './plugins/auth.plugin';
import zodPlugin from './plugins/zod.plugin';
import swaggerPlugin from './plugins/swagger.plugin';

import { errorHandler } from './shared/errors/error-handler';
import { registerRoutes } from './routes';
import { env } from './config/env';

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

  // Register CORS
  await app.register(cors, {
    origin: env.NODE_ENV === 'production' ? false : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Register multipart (file upload support)
  await app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB max

  // Serve uploaded files (local storage) with aggressive caching
  await app.register(fastifyStatic, {
    root: path.join(process.cwd(), 'uploads'),
    prefix: '/uploads/',
    decorateReply: false,
    maxAge: '7d',
    immutable: true,
    lastModified: true,
    etag: true,
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
