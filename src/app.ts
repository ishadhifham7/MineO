import Fastify from "fastify";
import cors from "@fastify/cors";

import firebasePlugin from "./plugins/firebase.plugin";
import authPlugin from "./plugins/auth.plugin";
import zodPlugin from "./plugins/zod.plugin";
import swaggerPlugin from "./plugins/swagger.plugin";

import { errorHandler } from "./shared/errors/error-handler";
import { registerRoutes } from "./routes";

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(cors);
  app.register(firebasePlugin);
  app.register(authPlugin);
  app.register(zodPlugin);
  app.register(swaggerPlugin);

  app.setErrorHandler(errorHandler);

  registerRoutes(app);

  return app;
}
