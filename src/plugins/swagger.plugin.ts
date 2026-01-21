import { FastifyPluginAsync } from "fastify";

const swaggerPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(require("@fastify/swagger"), {
    swagger: {
      info: {
        title: "MineO API",
        description: "Backend API for MineO",
        version: "1.0.0",
      },
    },
  });

  await fastify.register(require("@fastify/swagger-ui"), {
    routePrefix: "/docs",
  });
};

export default swaggerPlugin;
