// constants/env.ts
// Reads API URL from .env or defaults to local network
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.31.3.209:3001";

export const env = {
  API_BASE_URL: API_URL,
} as const;
