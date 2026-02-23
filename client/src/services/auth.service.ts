import axios from "axios";
import { env } from "../../constants/env";
import { saveToken, removeToken } from "../utils/tokenStorage";

/**
 * Auth API Client
 * Uses auto-detected backend URL - works on any network!
 */
const authClient = axios.create({
  baseURL: env.API_URL,
  timeout: 30000, // 30 seconds for auth requests
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("🔧 Auth Service initialized with:", env.API_URL);

// Sends user data to the backend - user signup
export const signupUser = async (data: {
  name: string;
  email: string;
  password: string;
  dob: string;
}) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),

    });

    const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Signup failed");
  }

  return result;
};

// ======================= user login =============================
export const loginUser = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Login failed");
    }

    // save JWT token locally
    if (result.token) {
    await saveToken(result.token);
    }

    return result;
};



// User logout & remove stored token

export const logoutUser = async () => {
  await removeToken();
};
