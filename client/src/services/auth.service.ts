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
    const response = await authClient.post("/auth/signup", data);

    //auto-login after signup
    if (response.data?.token) {
      await saveToken(response.data.token);
    }
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Server responded with an error
      throw new Error(error.response.data?.message || "Signup failed");
    } else if (error.request) {
      // Request was made but no response received
      throw new Error(
        `Cannot connect to backend at ${env.API_URL}.\nPlease ensure:\n` +
          "1. EXPO_PUBLIC_API_URL points to a reachable backend\n" +
          "2. Deployment is healthy\n" +
          "3. Device has internet access",
      );
    } else {
      throw new Error(error.message || "Signup failed");
    }
  }
};

// ======================= user login =============================
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await authClient.post("/auth/login", {
      email,
      password,
    });

    // save JWT token locally
    if (response.data.token) {
      await saveToken(response.data.token);
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data?.message || "Login failed");
    } else if (error.request) {
      // No response received
      throw new Error(
        `Cannot connect to backend at ${env.API_URL}.\nPlease ensure:\n` +
          "1. EXPO_PUBLIC_API_URL points to a reachable backend\n" +
          "2. Deployment is healthy\n" +
          "3. Device has internet access",
      );
    } else {
      // Request setup error
      throw new Error(error.message || "Login failed");
    }
  }
};

// User logout & remove stored token

export const logoutUser = async () => {
  await removeToken();
};
