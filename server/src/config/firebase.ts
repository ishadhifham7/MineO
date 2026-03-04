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
if (!admin.apps.length && (hasValidCredentials || !isDevelopment)) {
  try {
    const appConfig: admin.AppOptions = {
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    };
    // Only set storageBucket when configured to avoid SDK errors
    if (env.FIREBASE_STORAGE_BUCKET) {
      appConfig.storageBucket = env.FIREBASE_STORAGE_BUCKET;
    }
    admin.initializeApp(appConfig);
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    if (isDevelopment) {
      console.warn('⚠️ Firebase initialization failed in development mode');
      console.warn('⚠️ Running without Firebase. Some features may not work.');
    } else {
      throw error;
    }
  }
}

// Create mock implementations for development without Firebase
const createMockFirestore = () => {
  const mockCollection = () => ({
    doc: () => mockDoc(),
    where: () => mockQuery(),
    add: async () => ({ id: 'mock-id' }),
    get: async () => ({ docs: [], empty: true }),
  });

  const mockDoc = () => ({
    get: async () => ({ exists: false, data: () => null }),
    set: async () => {},
    update: async () => {},
    delete: async () => {},
    collection: mockCollection,
  });

  const mockQuery = () => ({
    get: async () => ({ docs: [], empty: true }),
    where: () => mockQuery(),
    orderBy: () => mockQuery(),
    limit: () => mockQuery(),
  });

  return {
    collection: mockCollection,
    doc: mockDoc,
    settings: () => {},
    batch: () => ({
      set: () => {},
      update: () => {},
      delete: () => {},
      commit: async () => {},
    }),
  } as any;
};

const createMockAuth = () =>
  ({
    verifyIdToken: async () => ({ uid: 'mock-user' }),
    createUser: async () => ({ uid: 'mock-user' }),
    getUserByEmail: async () => ({ uid: 'mock-user' }),
  }) as any;

export const firebaseAdmin = admin.apps.length ? admin : null;
export const firestore = admin.apps.length ? admin.firestore() : createMockFirestore();
export const auth = admin.apps.length ? admin.auth() : createMockAuth();

// Mock bucket for development without Firebase Storage
const createMockBucket = () =>
  ({
    file: (path: string) => ({
      save: async () => {},
      delete: async () => {},
      getSignedUrl: async () => ['https://mock-url.example.com/image.jpg'],
      getMetadata: async () => [{}],
      makePublic: async () => {},
      name: path,
    }),
    name: 'mock-bucket',
  }) as any;

export const storageBucket =
  admin.apps.length && env.FIREBASE_STORAGE_BUCKET
    ? admin.storage().bucket(env.FIREBASE_STORAGE_BUCKET)
    : createMockBucket();

// Create a compatible Timestamp class for both real and mock Firebase
class MockTimestamp {
  seconds: number;
  nanoseconds: number;

  constructor(seconds: number, nanoseconds: number) {
    this.seconds = seconds;
    this.nanoseconds = nanoseconds;
  }

  toDate(): Date {
    return new Date(this.seconds * 1000);
  }

  toMillis(): number {
    return this.seconds * 1000;
  }

  isEqual(other: any): boolean {
    return this.seconds === other.seconds && this.nanoseconds === other.nanoseconds;
  }

  static now(): MockTimestamp {
    const now = Date.now();
    return new MockTimestamp(Math.floor(now / 1000), (now % 1000) * 1000000);
  }

  static fromDate(date: Date): MockTimestamp {
    const ms = date.getTime();
    return new MockTimestamp(Math.floor(ms / 1000), (ms % 1000) * 1000000);
  }
}

export const Timestamp = admin.apps.length ? admin.firestore.Timestamp : (MockTimestamp as any);

// Ensure Firestore ignores undefined fields if initialized
if (admin.apps.length) {
  firestore.settings({ ignoreUndefinedProperties: true });
}
