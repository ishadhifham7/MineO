// Environment configuration
// Auto-detects the correct backend URL for web, Android emulator, and physical devices

import { Platform } from "react-native";

const API_URL_FROM_ENV = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, "");
const LAN_IP =
  process.env.EXPO_PUBLIC_API_URL
    ?.replace(/^https?:\/\//, "")
    .replace(/:\d+$/, "") || "192.168.8.100";
const PORT = "3001";

function getApiUrl(): string {
  // If explicitly provided, always use env value as-is (supports https + custom ports).
  if (API_URL_FROM_ENV) {
    return API_URL_FROM_ENV;
  }

  if (Platform.OS === "web") {
    // Web: use the same hostname the browser is on (works for both localhost and LAN)
    if (typeof window !== "undefined" && window.location) {
      return `http://${window.location.hostname}:${PORT}`;
    }
    return `http://localhost:${PORT}`;
  }

  if (Platform.OS === "android") {
    // Android emulator uses 10.0.2.2 to reach host machine
    // Physical devices use the LAN IP
    // We use LAN IP by default since Expo Go = physical device
    return `http://${LAN_IP}:${PORT}`;
  }

  // iOS / other: use LAN IP
  return `http://${LAN_IP}:${PORT}`;
}

const API_URL = getApiUrl();

export const env = {
  API_URL, // Full base URL: http://IP:3001
  API_BASE_URL: `${API_URL}/api/v1`, // API base with version: http://IP:3001/api/v1
};

// Export as named constants for backward compatibility
export const API_URL_EXPORT = env.API_URL;
export const API_BASE_URL = env.API_BASE_URL;

console.log("\n========================================");
console.log("📡 API CONFIGURATION");
console.log("========================================");
console.log("Platform:", Platform.OS);
console.log("Using EXPO_PUBLIC_API_URL:", Boolean(API_URL_FROM_ENV));
console.log("API_URL:", env.API_URL);
console.log("API_BASE_URL:", env.API_BASE_URL);
console.log("========================================\n");
