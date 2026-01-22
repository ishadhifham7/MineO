import { DocumentData, QuerySnapshot } from 'firebase-admin/firestore';
import { getCurrentTimestamp } from './date';

/**
 * Base interface for all documents
 */
export interface BaseDocument {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Convert Firestore document to plain object with ID
 */
export function documentToObject<T extends DocumentData>(
  doc: FirebaseFirestore.DocumentSnapshot
): (T & { id: string }) | null {
  if (!doc.exists) return null;
  return {
    id: doc.id,
    ...doc.data(),
  } as T & { id: string };
}

/**
 * Convert Firestore query snapshot to array of objects
 */
export function queryToArray<T extends DocumentData>(
  snapshot: QuerySnapshot
): (T & { id: string })[] {
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (T & { id: string })[];
}

/**
 * Add timestamps to document data
 */
export function withTimestamps<T extends Record<string, any>>(
  data: T
): T & {
  createdAt: string;
  updatedAt: string;
} {
  const now = getCurrentTimestamp();
  return {
    ...data,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Update timestamp on document
 */
export function withUpdatedTimestamp<T extends Record<string, any>>(
  data: T
): T & {
  updatedAt: string;
} {
  return {
    ...data,
    updatedAt: getCurrentTimestamp(),
  };
}

/**
 * Paginate Firestore query results
 */
export interface PaginationOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}
