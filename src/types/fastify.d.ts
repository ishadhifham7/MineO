import 'fastify';
import { Firestore } from 'firebase-admin/firestore';
import { Auth } from 'firebase-admin/auth';
import { ZodSchema } from 'zod';

declare module 'fastify' {
  interface FastifyInstance {
    firestore: Firestore;
    firebaseAuth: Auth;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    validate: <T>(schema: ZodSchema<T>, data: unknown) => T;
  }

  interface FastifyRequest {
    user?: {
      uid: string;
      email?: string;
      emailVerified?: boolean;
    };
  }
}
