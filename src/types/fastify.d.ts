import "fastify";
import { Firestore } from "firebase-admin/firestore";

declare module "fastify" {
  interface FastifyInstance {
    firestore: Firestore;
    authenticate: any;
    validate: any;
  }

  interface FastifyRequest {
    user?: any;
  }
}
