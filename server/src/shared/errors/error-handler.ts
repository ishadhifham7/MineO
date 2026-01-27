import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError, ZodIssue } from 'zod';
import { AppError } from './app-error';

/**
 * Global error handler for Fastify
 */
export function errorHandler(
  error: FastifyError | AppError | ZodError | Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Log error for debugging
  request.log.error(error);

  // Handle ZodError
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: 'Validation Error',
      message: 'Invalid request data',
      details: error.issues.map((e: ZodIssue) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Handle AppError
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: error.name,
      message: error.message,
    });
  }

  // Handle Fastify validation errors
  if ('validation' in error) {
    return reply.status(400).send({
      error: 'Validation Error',
      message: error.message,
      details: error.validation,
    });
  }

  // Handle generic errors
  const statusCode = 'statusCode' in error ? (error as FastifyError).statusCode || 500 : 500;

  return reply.status(statusCode).send({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : error.message,
  });
}
