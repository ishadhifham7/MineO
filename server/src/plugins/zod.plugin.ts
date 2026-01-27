import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { ZodSchema, ZodError, ZodIssue } from 'zod';
import { AppError } from '../shared/errors/app-error';

/**
 * Zod validation plugin - provides validation decorator
 */
const zodPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('validate', <T>(schema: ZodSchema<T>, data: unknown): T => {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map((e: ZodIssue) => `${e.path.join('.')}: ${e.message}`);
        throw new AppError(`Validation failed: ${messages.join(', ')}`, 400);
      }
      throw error;
    }
  });

  fastify.log.info('✅ Zod validation plugin registered');
};

export default fp(zodPlugin, {
  name: 'zod-plugin',
});
