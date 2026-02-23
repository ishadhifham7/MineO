// Environment configuration
// This file reads from .env variables set by Expo

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.31.23.152:3001";

export const env = {
  API_BASE_URL: `${API_URL}/api/v1`,
  API_URL: API_URL,
};
