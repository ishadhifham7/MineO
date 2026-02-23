// Environment configuration
// This file reads from .env variables set by Expo

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.103:3001";

export const env = {
  API_BASE_URL: `${API_URL}/api/v1`,
  API_URL,
};

console.log("📡 Final API Configuration:", env);
