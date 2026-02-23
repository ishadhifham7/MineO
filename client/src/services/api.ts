// src/services/api.ts
import axios from "axios";
import { Platform } from "react-native";

// Backend URL configuration
// Priority: runtime env override -> platform default (android emulator -> 10.0.2.2, others -> localhost)
// For a physical device set the BACKEND_IP env variable to your machine LAN IP (e.g., 192.168.1.103)
const BACKEND_PORT = "3001";
const DEFAULT_DEV_IP = Platform.OS === "android" ? "10.0.2.2" : "localhost";
const BACKEND_IP = (typeof process !== "undefined" && process.env?.BACKEND_IP) ||
  // allow a manual global override (useful when running via Expo start with REACT_NATIVE_PACKAGER_HOSTNAME)
  (global as any).__BACKEND_IP__ ||
  DEFAULT_DEV_IP;

// Base URL for API (without specific module path)
export const API_BASE_URL = (typeof process !== "undefined" && process.env?.API_BASE_URL)
  ? process.env.API_BASE_URL
  : `http://${BACKEND_IP}:${BACKEND_PORT}`;

// Base URL for journal API
const getBaseURL = () => {
  return `${API_BASE_URL}/api/v1/journal`;
};

export const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log("🔵 API Request:", config.method?.toUpperCase(), config.url);
    console.log("📦 Data:", config.data);
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
      console.error(
        "❌ No Response - Is backend running on http://localhost:3001?",
      );
      console.error("Request:", error.request);
    } else {
      // Something else happened
      console.error("❌ Request Setup Error:", error.message);
    }
    return Promise.reject(error);
  },
);
