import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { env } from '../config/env';

/**
 * Swagger documentation plugin
 */
const swaggerPlugin: FastifyPluginAsync = async (fastify) => {
  const docsBaseUrl = env.PUBLIC_BASE_URL || `http://localhost:${env.PORT}`;

  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'MineO API',
        description: 'Backend API for MineO - Personal Growth & Productivity Platform',
        version: '1.0.0',
      },
      servers: [
        {
          url: docsBaseUrl,
          description: env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  await fastify.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
    staticCSP: true,
  });

  fastify.log.info('✅ Swagger documentation available at /docs');
};

export default fp(swaggerPlugin, {
  name: 'swagger-plugin',
});
