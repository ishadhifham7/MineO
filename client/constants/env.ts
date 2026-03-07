// Environment configuration
// This file reads from .env variables set by Expo

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.103:3001";

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
console.log("API_URL:", env.API_URL);
console.log("API_BASE_URL:", env.API_BASE_URL);
console.log("========================================\n");
