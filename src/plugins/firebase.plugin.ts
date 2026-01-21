import { FastifyPluginAsync } from "fastify";
import { firestore } from "../config/firbase";

const firebasePlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate("firestore", firestore);
};

export default firebasePlugin;
