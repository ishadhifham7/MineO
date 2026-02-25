import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { firestore } from '../../config/firebase';
import { env } from '../../config/env';

const USERS_COLLECTION = 'users';

// ============= signup user - creates user securely in firestore ================

export const signupUser = async (data: {
  name: string;
  email: string;
  password: string;
  dob: string;
  bio?: string;
  gender?: string;
  country?: string;
  profilePhoto?: string;
}) => {
  const usersRef = firestore.collection(USERS_COLLECTION);

  // check for an existing user with the same email.
  const existing = await usersRef.where('email', '==', data.email).get();

  if (!existing.empty) {
    throw new Error('User already exists');
  }

  // if there is no user with that email:

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const docRef = await usersRef.add({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    dob: data.dob,

    bio: data.bio ?? "",
    gender: data.gender ?? "",
    country: data.country ?? "",
    profilePhoto: data.profilePhoto ?? "",

    createdAt: new Date(),
  });

  return { id: docRef.id };
};

//================= login user - verifies password and returns JWT ===================

export const loginUser = async (email: string, password: string) => {
  console.log('🔵 loginUser called with email:', email);

  const usersRef = firestore.collection(USERS_COLLECTION);
  console.log('🔵 Got users collection reference');

  console.log('🔵 Querying Firestore for user...');
  const snapshot = await usersRef.where('email', '==', email).get();
  console.log('🔵 Firestore query completed');

  // check for an existing user
  if (snapshot.empty) {
    console.log('❌ User not found');
    throw new Error('Invalid email or password');
  }

  // if there is an user account exists;
  const userDoc = snapshot.docs[0];
  const user = userDoc.data();
  console.log('🔵 User found, comparing password...');

  const isMatch = await bcrypt.compare(password, user.password);
  console.log('🔵 Password comparison completed, match:', isMatch);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  console.log('🔵 Generating JWT token...');
  //create JWD token which expires in 3 days
  const token = jwt.sign({ userId: userDoc.id, email: user.email }, env.JWT_SECRET, {
    expiresIn: '3d',
  });
  console.log('🔵 JWT token generated successfully');

  return {
    token,
  };
};
