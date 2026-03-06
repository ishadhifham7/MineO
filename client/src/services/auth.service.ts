import axios from "axios";
import { env } from "../../constants/env";
import { saveToken, removeToken } from "../utils/tokenStorage";

/**
 * Auth API Client
 * Uses auto-detected backend URL - works on any network!
 */
const authClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 60000, // 60 seconds for auth requests (increased for Firebase operations)
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
    console.error("❌ Signup error:", error.message);
    console.error("📡 Backend URL:", env.API_BASE_URL);
    
    if (error.response) {
      // Server responded with an error
      console.error("❌ Server responded with error:", error.response.status);
      throw new Error(error.response.data?.message || "Signup failed");
    } else if (error.request) {
      // Request was made but no response received
      console.error("❌ No response from server - Backend may not be running!");
      console.error("💡 Solution:");
      console.error("   1. Make sure backend server is running on port 3001");
      console.error("   2. Run: cd server && npm run dev");
      console.error("   3. Check firewall settings");
      console.error("   4. Both devices must be on the same WiFi network");
      throw new Error(
        `Cannot connect to server at ${env.API_URL}.\nPlease ensure:\n` +
        "1. Backend server is running (cd server && npm run dev)\n" +
        "2. You're on the same WiFi network\n" +
        "3. Firewall allows connections on port 3001"
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
    console.error("📡 Backend URL:", env.API_BASE_URL);

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
      console.error("💡 Solution:");
      console.error("   1. Make sure backend server is running on port 3001");
      console.error("   2. Run: cd server && npm run dev");
      console.error("   3. Check firewall settings");
      console.error("   4. Both devices must be on the same WiFi network");
      throw new Error(
        `Cannot connect to server at ${env.API_URL}.\nPlease ensure:\n` +
        "1. Backend server is running (cd server && npm run dev)\n" +
        "2. You're on the same WiFi network\n" +
        "3. Firewall allows connections on port 3001"
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
