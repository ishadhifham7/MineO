import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { firestore } from "../../config/firebase";
import { env } from "../../config/env";

const USERS_COLLECTION = 'users';

// ============= signup user - creates user securely in firestore ================

export const signupUser = async (data: {
    name: string;
    email: string;
    password: string;
    dob: string;
}) => {

    const normalizedEmail = data.email.trim().toLowerCase();

    const usersRef = firestore.collection(USERS_COLLECTION);

    // check for an existing user with the same email.
    const existing = await usersRef.where("email", "==", normalizedEmail).get();

    if (!existing.empty) {
        throw new Error("User already exists");
    }

    // if there is no user with that email:

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const docRef = await usersRef.add({
        name: data.name,
        email: normalizedEmail,
        password: hashedPassword,
        dob: data.dob,
        createdAt: new Date(),
    });

    return { id: docRef.id };

};

//================= login user - verifies password and returns JWT ===================

export const loginUser = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    const usersRef = firestore.collection(USERS_COLLECTION);

    const snapshot = await usersRef.where("email", "==", normalizedEmail).get();

    // check for an existing user
    if (snapshot.empty) {
        throw new Error("Invalid email or password");
    }

    // if there is an user account exists;
    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    if (!env.JWT_SECRET) {
        throw new Error("Server auth is not configured (missing JWT secret)");
    }

    //create JWD token which expires in 3 days
    const token = jwt.sign(
        { userId: userDoc.id, email: user.email },
        env.JWT_SECRET,
        { expiresIn: "3d" }
    );

    return {
        token,
    };
};
