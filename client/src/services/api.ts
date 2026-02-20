// src/services/api.ts
import axios from "axios";
import { env } from "../../constants/env";

// Using API URL from .env file (EXPO_PUBLIC_API_URL)
const getBaseURL = () => {
  return `${env.API_BASE_URL}/journal`;
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
        `❌ No Response - Is backend running on ${env.API_BASE_URL}?`,
      );
      console.error("Request:", error.request);
    } else {
      // Something else happened
      console.error("❌ Request Setup Error:", error.message);
    }
    return Promise.reject(error);
  },
);
