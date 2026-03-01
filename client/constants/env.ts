// Environment configuration
// This file reads from .env variables set by Expo
import { Platform } from "react-native";

const SERVER_PORT = 3001;

/**
 * Auto-detect the server URL based on the current environment.
 * - On web: uses the browser's hostname (works on any WiFi/IP)
 * - On native: uses EXPO_PUBLIC_API_URL from .env (fallback to localhost)
 */
function getApiUrl(): string {
  // If explicitly set in .env, always use that
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // On web, derive from the browser's current hostname
  if (Platform.OS === "web" && typeof window !== "undefined" && window.location) {
    const hostname = window.location.hostname; // e.g., "192.168.8.100" or "localhost"
    return `http://${hostname}:${SERVER_PORT}`;
  }

  // Fallback for native
  return `http://localhost:${SERVER_PORT}`;
}

const API_URL = getApiUrl();

export const env = {
  API_BASE_URL: `${API_URL}/api/v1`,
  API_URL: API_URL,
};
