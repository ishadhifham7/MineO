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
  try {
    console.log("🔵 Attempting signup to:", `${env.API_BASE_URL}/auth/signup`);
    const response = await authClient.post("/auth/signup", data);

    console.log("Signup successful:", response.data);

    //auto-login after signup
    if (response.data?.token) {
      await saveToken(response.data.token);
      console.log("Token saved after signup");
    }
    return response.data;
  } catch (error: any) {
    console.error("Signup error:", error.message);
    if (error.response) {
      throw new Error(error.response.data?.message || "Signup failed");
    } else if (error.request) {
      throw new Error(
        "Network error. Please check your connection and ensure backend is running.",
      );
    } else {
      throw new Error(error.message || "Signup failed");
    }
  }
};

// ======================= user login =============================
export const loginUser = async (email: string, password: string) => {
  try {
    const url = `${env.API_BASE_URL}/auth/login`;
    console.log("🔵 Attempting login to:", url);

    const response = await authClient.post("/auth/login", {
      email,
      password,
    });

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
