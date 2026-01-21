import { FastifyPluginAsync } from "fastify";
import { firebaseAdmin } from "../config/firbase";

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate("authenticate", async (request: any, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const token = authHeader.replace("Bearer ", "");

    try {
      const decoded = await firebaseAdmin.auth().verifyIdToken(token);
      request.user = decoded;
    } catch {
      return reply.status(401).send({ message: "Invalid token" });
    }
  });
};

export default authPlugin;
