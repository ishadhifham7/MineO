import { FastifyPluginAsync } from "fastify";
import { ZodSchema } from "zod";

const zodPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate("validate", (schema: ZodSchema, data: unknown) => {
    return schema.parse(data);
  });
};

export default zodPlugin;
