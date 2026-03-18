import admin from 'firebase-admin';
import { env } from './env';

const isDevelopment = env.NODE_ENV === 'development';

// Check if we have REAL Firebase credentials (not mock ones)
const hasRealFirebaseCredentials = 
  env.FIREBASE_PROJECT_ID && 
  env.FIREBASE_CLIENT_EMAIL && 
  env.FIREBASE_PRIVATE_KEY &&
  !env.FIREBASE_PROJECT_ID.includes('mock') &&
  !env.FIREBASE_PROJECT_ID.includes('dev-') &&
  !env.FIREBASE_CLIENT_EMAIL.includes('mock');

/**
 * Initialize Firebase Admin SDK ONLY if we have real credentials
 */
if (!admin.apps.length && hasRealFirebaseCredentials) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    if (!isDevelopment) {
      throw error;
    }
  }
}

// Show warning if using mock database
if (!hasRealFirebaseCredentials) {
  console.log('⚠️  Running in DEVELOPMENT MODE with MOCK database');
  console.log('⚠️  All data is stored in memory and will be lost on restart');
  console.log('⚠️  To use real Firebase, update .env with real credentials');
}

// Create mock implementations for development without Firebase
// This uses an in-memory store for testing
const mockDatabase: any = {
  users: {},
  goals: {},
  habits: {},
  journals: {},
};

let mockIdCounter = 1;

const createMockFirestore = () => {
  const mockCollection = (collectionName: string) => ({
    doc: (id?: string) => mockDoc(collectionName, id),
    where: (field: string, op: string, value: any) => mockQuery(collectionName, field, op, value),
    add: async (data: any) => {
      const id = `${collectionName}_${mockIdCounter++}`;
      mockDatabase[collectionName] = mockDatabase[collectionName] || {};
      mockDatabase[collectionName][id] = { id, ...data };
      console.log(`✅ Mock: Added document to ${collectionName}:`, { id, ...data });
      return { id };
    },
    get: async () => {
      const collection = mockDatabase[collectionName] || {};
      const docs = Object.values(collection).map((data: any) => ({
        id: data.id,
        data: () => data,
        exists: true,
      }));
      return { docs, empty: docs.length === 0 };
    },
  });

  const mockDoc = (collectionName: string, id?: string) => ({
    get: async () => {
      const collection = mockDatabase[collectionName] || {};
      const data = id ? collection[id] : null;
      return {
        id,
        exists: !!data,
        data: () => data,
      };
    },
    set: async (data: any) => {
      mockDatabase[collectionName] = mockDatabase[collectionName] || {};
      mockDatabase[collectionName][id!] = { id, ...data };
      console.log(`✅ Mock: Set document in ${collectionName}/${id}`);
    },
    update: async (data: any) => {
      if (mockDatabase[collectionName]?.[id!]) {
        mockDatabase[collectionName][id!] = {
          ...mockDatabase[collectionName][id!],
          ...data,
        };
        console.log(`✅ Mock: Updated document in ${collectionName}/${id}`);
      }
    },
    delete: async () => {
      if (mockDatabase[collectionName]?.[id!]) {
        delete mockDatabase[collectionName][id!];
        console.log(`✅ Mock: Deleted document from ${collectionName}/${id}`);
      }
    },
    collection: (subCollection: string) => mockCollection(`${collectionName}/${id}/${subCollection}`),
  });

  const mockQuery = (collectionName: string, field: string, op: string, value: any) => {
    const query: any = {
      get: async () => {
        const collection = mockDatabase[collectionName] || {};
        let docs = Object.values(collection).filter((doc: any) => {
          if (op === '==') return doc[field] === value;
          if (op === '>') return doc[field] > value;
          if (op === '<') return doc[field] < value;
          if (op === '>=') return doc[field] >= value;
          if (op === '<=') return doc[field] <= value;
          if (op === '!=') return doc[field] !== value;
          return false;
        });

        // Apply limit if set
        if (query._limit) {
          docs = docs.slice(0, query._limit);
        }

        const resultDocs = docs.map((data: any) => ({
          id: data.id,
          data: () => data,
          exists: true,
        }));

        console.log(`🔍 Mock: Query ${collectionName} where ${field} ${op} ${value} returned ${resultDocs.length} results`);
        return { docs: resultDocs, empty: resultDocs.length === 0 };
      },
      where: (newField: string, newOp: string, newValue: any) => 
        mockQuery(collectionName, newField, newOp, newValue),
      orderBy: () => query,
      limit: (n: number) => {
        query._limit = n;
        return query;
      },
    };
    return query;
  };

  return {
    collection: mockCollection,
    doc: (path: string) => {
      const [collectionName, id] = path.split('/');
      return mockDoc(collectionName, id);
    },
    settings: () => {},
    batch: () => ({
      set: () => {},
      update: () => {},
      delete: () => {},
      commit: async () => {},
    }),
  } as any;
};

const createMockAuth = () => ({
  verifyIdToken: async () => ({ uid: 'mock-user' }),
  createUser: async () => ({ uid: 'mock-user' }),
  getUserByEmail: async () => ({ uid: 'mock-user' }),
} as any);

export const firebaseAdmin = admin.apps.length ? admin : null;
export const firestore = admin.apps.length ? admin.firestore() : createMockFirestore();
export const auth = admin.apps.length ? admin.auth() : createMockAuth();

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

export const Timestamp = admin.apps.length ? admin.firestore.Timestamp : MockTimestamp as any;

// Ensure Firestore ignores undefined fields if initialized
if (admin.apps.length) {
  firestore.settings({ ignoreUndefinedProperties: true });
}
