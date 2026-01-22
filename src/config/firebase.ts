import admin from 'firebase-admin';
import { env } from './env';

/**
 * Initialize Firebase Admin SDK
 */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY,
    }),
  });
}

export const firebaseAdmin = admin;
export const firestore = admin.firestore();
export const auth = admin.auth();
