import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "./app-error";

export function errorHandler(
  error: FastifyError | AppError,
  _: FastifyRequest,
  reply: FastifyReply,
) {
  const statusCode = error instanceof AppError ? error.statusCode : 500;

  reply.status(statusCode).send({
    message: error.message || "Internal Server Error",
  });
}
