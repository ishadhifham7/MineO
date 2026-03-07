// src/services/api.ts
import axios from "axios";
import { Platform } from "react-native";

// Backend URL configuration
// For Android emulator: use 10.0.2.2
// For physical device: use your computer's IP address (e.g., 192.168.1.103)
const BACKEND_IP = "192.168.1.103"; // Your computer's IP
const BACKEND_PORT = "3001";

// Base URL for API (without specific module path)
export const API_BASE_URL = `http://${BACKEND_IP}:${BACKEND_PORT}`;

// Base URL for journal API
const getBaseURL = () => {
  return `${env.API_BASE_URL}/journal`;
};

export const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Automatically adds JWT token to Authorization header
console.log("🔧 Journal API initialized with:", getBaseURL());

// Request interceptor for debugging
api.interceptors.request.use(
  async (config) => {
    console.log("🔵 API Request:", config.method?.toUpperCase(), config.url);
    console.log("📦 Data:", config.data);

    // Get JWT token from AsyncStorage and add to headers
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error(
        "❌ Response Error:",
        error.response.status,
        error.response.data,
      );
    } else if (error.request) {
      // Request made but no response
      console.error("❌ No Response - Is backend running?", env.API_URL);
      console.error("Request:", error.request);
    } else {
      // Something else happened
      console.error("❌ Request Setup Error:", error.message);
    }
    return Promise.reject(error);
  },
);
