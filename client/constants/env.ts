// Environment configuration with automatic IP detection
// This file auto-detects your computer's IP address from Expo

import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Auto-detect IP address from Expo's development server
 * Works with Expo SDK 54+ - detects IP automatically for all team members!
 */
const getApiUrl = (): string => {
  const BACKEND_PORT = "3001";

  // Check if manually overridden in .env
  if (process.env.EXPO_PUBLIC_API_URL) {
    console.log(
      "📡 Using manual API URL from .env:",
      process.env.EXPO_PUBLIC_API_URL,
    );
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Auto-detect IP from Expo development server
  // Expo SDK 54 uses __DEV__ and exposes the dev server URL differently
  if (__DEV__) {
    try {
      // Method 1: Get from Metro bundler URL (most reliable)
      const scriptURL =
        (global as any).location?.href ||
        (Platform as any).__constants?.serverURL ||
        (Constants as any).linkingUri;

      if (scriptURL && typeof scriptURL === "string") {
        const match = scriptURL.match(/https?:\/\/([^:\/]+)/);
        if (match && match[1]) {
          const ip = match[1];
          const apiUrl = `http://${ip}:${BACKEND_PORT}`;
          console.log("📡 Auto-detected IP from Metro:", ip);
          console.log("📡 API URL:", apiUrl);
          return apiUrl;
        }
      }

      // Method 2: Check expo-constants (SDK 54+)
      const debuggerHost =
        Constants.expoConfig?.hostUri ||
        (Constants.manifest2 as any)?.extra?.expoClient?.hostUri ||
        (Constants as any).manifest?.debuggerHost ||
        (Constants as any).manifest?.hostUri;

      if (debuggerHost) {
        const ip = debuggerHost.split(":")[0];
        const apiUrl = `http://${ip}:${BACKEND_PORT}`;
        console.log("📡 Auto-detected IP from Constants:", ip);
        console.log("📡 API URL:", apiUrl);
        return apiUrl;
      }

      // Method 3: Extract from sourceUrl (Web/Metro bundler)
      const sourceUrl =
        (Constants as any).manifest?.bundleUrl || (Constants as any).sourceUrl;
      if (sourceUrl) {
        const match = sourceUrl.match(/https?:\/\/([^:\/]+)/);
        if (match && match[1]) {
          const ip = match[1];
          const apiUrl = `http://${ip}:${BACKEND_PORT}`;
          console.log("📡 Auto-detected IP from bundleUrl:", ip);
          console.log("📡 API URL:", apiUrl);
          return apiUrl;
        }
      }
    } catch (error) {
      console.warn("⚠️ Error during IP auto-detection:", error);
    }
  }

  // Fallback for when auto-detection fails
  const fallbackIp = Platform.OS === "android" ? "10.0.2.2" : "localhost";
  const fallbackUrl = `http://${fallbackIp}:${BACKEND_PORT}`;
  console.warn("⚠️ Auto-detection failed, using fallback:", fallbackUrl);
  console.warn("💡 If this doesn't work, set EXPO_PUBLIC_API_URL in .env");
  return fallbackUrl;
};

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
console.log("API_URL:", env.API_URL);
console.log("API_BASE_URL:", env.API_BASE_URL);
console.log("========================================\n");
