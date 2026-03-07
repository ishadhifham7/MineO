import axios from "axios";
import { env } from "../../constants/env";
import { saveToken, removeToken } from "../utils/tokenStorage";

/**
 * Auth API Client
 * Uses auto-detected backend URL - works on any network!
 */
const authClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 30000, // 30 seconds for auth requests
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("🔧 Auth Service initialized with:", env.API_BASE_URL);

// Sends user data to the backend - user signup
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
    const response = await fetch(`${env.API_BASE_URL}/auth/signup`, {
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
  try {
    const response = await authClient.post("/auth/login", { email, password });

    console.log("✅ Login successful:", response.data);

    // save JWT token locally
    if (response.data.token) {
      await saveToken(response.data.token);
    }

    return response.data;
  } catch (error: any) {
    console.error("❌ Login error:", error);

    if (error.response) {
      // Server responded with error
      console.error(
        "❌ Server error:",
        error.response.status,
        error.response.data,
      );
      throw new Error(error.response.data?.message || "Login failed");
    } else if (error.request) {
      // No response received
      console.error(
        "❌ No response from server. Backend URL:",
        env.API_BASE_URL,
      );
      throw new Error(
        "Cannot reach server. Please check if backend is running at " +
          env.API_URL,
      );
    } else {
      // Request setup error
      console.error("❌ Request error:", error.message);
      throw new Error(error.message || "Login failed");
    }
  }
};

// User logout & remove stored token

export const logoutUser = async () => {
  await removeToken();
};
