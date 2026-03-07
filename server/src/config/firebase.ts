import admin from 'firebase-admin';
import { env } from './env';

const isDevelopment = env.NODE_ENV === 'development';
const hasValidCredentials = 
  env.FIREBASE_PROJECT_ID !== 'dev-project' && 
  env.FIREBASE_CLIENT_EMAIL !== 'dev@example.com' &&
  env.FIREBASE_PRIVATE_KEY !== 'dev-key';

/**
 * Initialize Firebase Admin SDK
 */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

export const firebaseAdmin = admin;
export const firestore = admin.firestore();
export const auth = admin.auth();
export const Timestamp = admin.firestore.Timestamp;

// Ensure Firestore ignores undefined fields if initialized
if (admin.apps.length) {
  firestore.settings({ ignoreUndefinedProperties: true });
}
