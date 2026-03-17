// Environment configuration with automatic IP detection
// This file auto-detects your computer's IP address from Expo

import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Auto-detect IP address from Expo's development server
 * Enhanced with multiple detection methods for maximum reliability
 */
const getApiUrl = (): string => {
  const BACKEND_PORT = "3001";
  const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

  // Check if manually overridden in .env
  if (configuredApiUrl) {
    console.log("📡 Using configured API URL from .env:", configuredApiUrl);
    return configuredApiUrl;
  }

  // Auto-detect IP from Expo development server
  if (__DEV__) {
    try {
      console.log("🔍 Starting IP auto-detection...");

      // Method 1: Expo Config hostUri (Most reliable in Expo SDK 50+)
      const hostUri = Constants.expoConfig?.hostUri;
      if (hostUri) {
        const ip = hostUri.split(":")[0];
        if (ip && ip !== "localhost" && ip !== "127.0.0.1") {
          const apiUrl = `http://${ip}:${BACKEND_PORT}`;
          console.log("✅ Method 1: Detected IP from expoConfig.hostUri:", ip);
          console.log("📡 API URL:", apiUrl);
          return apiUrl;
        }
      }

      // Method 2: Check debuggerHost from manifest
      const debuggerHost =
        (Constants as any).manifest?.debuggerHost ||
        (Constants as any).manifest?.hostUri ||
        (Constants.manifest2 as any)?.extra?.expoClient?.hostUri;

      if (debuggerHost) {
        const ip = debuggerHost.split(":")[0];
        if (ip && ip !== "localhost" && ip !== "127.0.0.1") {
          const apiUrl = `http://${ip}:${BACKEND_PORT}`;
          console.log("✅ Method 2: Detected IP from debuggerHost:", ip);
          console.log("📡 API URL:", apiUrl);
          return apiUrl;
        }
      }

      // Method 3: Get from Metro bundler URL
      const scriptURL =
        (global as any).location?.href ||
        (Platform as any).__constants?.serverURL ||
        (Constants as any).linkingUri;

      if (scriptURL && typeof scriptURL === "string") {
        const match = scriptURL.match(/https?:\/\/([^:\/]+)/);
        if (match && match[1]) {
          const ip = match[1];
          if (ip !== "localhost" && ip !== "127.0.0.1") {
            const apiUrl = `http://${ip}:${BACKEND_PORT}`;
            console.log("✅ Method 3: Detected IP from Metro bundler:", ip);
            console.log("📡 API URL:", apiUrl);
            return apiUrl;
          }
        }
      }

      // Method 4: Extract from sourceUrl/bundleUrl
      const sourceUrl =
        (Constants as any).manifest?.bundleUrl ||
        (Constants as any).sourceUrl ||
        (Constants as any).manifest?.url;

      if (sourceUrl) {
        const match = sourceUrl.match(/https?:\/\/([^:\/]+)/);
        if (match && match[1]) {
          const ip = match[1];
          if (ip !== "localhost" && ip !== "127.0.0.1") {
            const apiUrl = `http://${ip}:${BACKEND_PORT}`;
            console.log("✅ Method 4: Detected IP from bundleUrl:", ip);
            console.log("📡 API URL:", apiUrl);
            return apiUrl;
          }
        }
      }

      console.log("📋 Debug info:");
      console.log("  - hostUri:", Constants.expoConfig?.hostUri);
      console.log(
        "  - debuggerHost:",
        (Constants as any).manifest?.debuggerHost,
      );
      console.log("  - scriptURL:", scriptURL);
      console.log("  - sourceUrl:", sourceUrl);
    } catch (error) {
      console.warn("⚠️ Error during IP auto-detection:", error);
    }
  }

  // Fallback for when auto-detection fails
  const fallbackIp = Platform.OS === "android" ? "10.0.2.2" : "localhost";
  const fallbackUrl = `http://${fallbackIp}:${BACKEND_PORT}`;
  console.warn("⚠️ Auto-detection failed, using fallback:", fallbackUrl);
  console.warn("💡 To use a deployed backend, set in client/.env:");
  console.warn("   EXPO_PUBLIC_API_URL=https://mineo-pcov.onrender.com");
  console.warn("💡 To manually set local IP, create client/.env with:");
  console.warn("   EXPO_PUBLIC_API_URL=http://YOUR_IP:3001");
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
