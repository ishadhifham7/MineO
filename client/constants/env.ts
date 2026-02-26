// Environment configuration
// This file reads from .env variables set by Expo

import Constants from "expo-constants";

/**
 * Auto-detect the backend URL from Expo's development server
 * This allows the app to work on any network without hardcoding IP addresses
 */
const getAutoDetectedURL = (): string => {
  // Try to use environment variable if explicitly set
  if (process.env.EXPO_PUBLIC_API_URL) {
    console.log(
      "🔧 Using configured API URL:",
      process.env.EXPO_PUBLIC_API_URL,
    );
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Auto-detect IP from Expo
  const expoHostUri = Constants.expoConfig?.hostUri;
  if (expoHostUri) {
    const ip = expoHostUri.split(":")[0];
    const autoUrl = `http://${ip}:3001`;
    console.log("🔍 Auto-detected IP from Expo:", ip);
    console.log("✅ Auto-configured API URL:", autoUrl);
    return autoUrl;
  }

  // Fallback (should rarely be used)
  console.warn("⚠️ Could not auto-detect IP. Using localhost fallback.");
  return "http://localhost:3001";
};

const API_URL = getAutoDetectedURL();

export const env = {
  API_BASE_URL: `${API_URL}/api/v1`,
  API_URL: API_URL,
};

console.log("📡 Final API Configuration:", env);
