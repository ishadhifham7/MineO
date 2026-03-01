import { FastifyInstance } from "fastify";
import { UpdateUserProfileBody, UserProfile } from "./user.types";
import { getCurrentTimestamp } from "../../shared/utils/date";

// Firestore collection used in signup code earlier - "users"
const USERS_COLLECTION = "users";

/**
 * Find a user document.
 *
 * IMPORTANT: some codebases store users as doc(uid),
 * but others use auto-ID docs and store uid inside a field.
 *
 * This function supports BOTH:
 *  1) users/{uid}
 *  2) users where field "uid" == uid OR "userId" == uid
 */
export async function findUserDocByUid(fastify: FastifyInstance, uid: string) {
  const usersRef = fastify.firestore.collection(USERS_COLLECTION);

  // 1) Try doc(id=uid) first
  const directDocRef = usersRef.doc(uid);
  const directSnap = await directDocRef.get();
  if (directSnap.exists) {
    return { ref: directDocRef, data: directSnap.data() as Record<string, any> };
  }

  // 2) Fallback: query by field
  // Try "uid" field
  const q1 = await usersRef.where("uid", "==", uid).limit(1).get();
  if (!q1.empty) {
    const doc = q1.docs[0];
    return { ref: doc.ref, data: doc.data() };
  }

  // Try "userId" field (some projects use that)
  const q2 = await usersRef.where("userId", "==", uid).limit(1).get();
  if (!q2.empty) {
    const doc = q2.docs[0];
    return { ref: doc.ref, data: doc.data() };
  }

  return null;
}

export async function getMyProfile(fastify: FastifyInstance, uid: string): Promise<UserProfile> {
  const result = await findUserDocByUid(fastify, uid);
  if (!result) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  const d = result.data;

  // normalize response
  return {
    uid,
    name: d.name,
    email: d.email,
    username: d.username,
    bio: d.bio,
    phoneNumber: d.phoneNumber,
    birthday: d.birthday ?? d.dob,
    gender: d.gender,
    country: d.country,
    showEmail: d.showEmail ?? false,
    showPhone: d.showPhone ?? false,
    activityTracking: d.activityTracking ?? true,
    dataSharing: d.dataSharing ?? false,
    photoUrl: d.photoUrl ?? d.profilePhoto,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

export async function patchMyProfile(
  fastify: FastifyInstance,
  uid: string,
  body: UpdateUserProfileBody
): Promise<UserProfile> {
  const result = await findUserDocByUid(fastify, uid);
  if (!result) throw new Error("PROFILE_NOT_FOUND");

  // Only update allowed keys that are present
  const updates: Record<string, any> = {};

  const { username, ...safeBody } = body as any;

  for (const [k, v] of Object.entries(safeBody)) {
    if (v !== undefined) updates[k] = v;
  }

  updates.updatedAt = getCurrentTimestamp();

  await result.ref.set(updates, { merge: true });

  // return latest
  const updatedSnap = await result.ref.get();
  const d = updatedSnap.data() || {};
  return {
    uid,
    name: d.name,
    email: d.email,
    username: d.username,
    bio: d.bio,
    phoneNumber: d.phoneNumber,
    birthday: d.birthday ?? d.dob,
    gender: d.gender,
    country: d.country,
    showEmail: d.showEmail ?? false,
    showPhone: d.showPhone ?? false,
    activityTracking: d.activityTracking ?? true,
    dataSharing: d.dataSharing ?? false,
    photoUrl: d.photoUrl,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}