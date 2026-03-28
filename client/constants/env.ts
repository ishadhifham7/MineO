// Environment configuration
// Auto-detects the correct backend URL for web, Android emulator, and physical devices

import { Platform } from "react-native";
import Constants from "expo-constants";

const DEPLOYED_API_URL = "https://mineo-pcov.onrender.com";
const API_URL_FROM_ENV = process.env.EXPO_PUBLIC_API_URL?.trim();

/**
 * Auto-detect IP address from Expo's development server
 * Enhanced with multiple detection methods for maximum reliability
 */
const getApiUrl = (): string => {
  const BACKEND_PORT = "3001";
  const configuredApiUrl = API_URL_FROM_ENV;

  // Check if manually overridden in .env
  if (configuredApiUrl) {
    return configuredApiUrl;
  }

  // Standalone EAS builds should default to deployed backend, not emulator localhost.
  if (!__DEV__) {
    return DEPLOYED_API_URL;
  }

  // Auto-detect IP from Expo development server
  if (__DEV__) {
    try {
      // Method 1: Expo Config hostUri (Most reliable in Expo SDK 50+)
      const hostUri = Constants.expoConfig?.hostUri;
      if (hostUri) {
        const ip = hostUri.split(":")[0];
        if (ip && ip !== "localhost" && ip !== "127.0.0.1") {
          const apiUrl = `http://${ip}:${BACKEND_PORT}`;
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
          return apiUrl;
        }
      }

      // Method 3: Get from Metro bundler URL
      const scriptURL =
        (globalThis as any).location?.href ||
        (Platform as any).__constants?.serverURL ||
        (Constants as any).linkingUri;

      if (scriptURL && typeof scriptURL === "string") {
        const match = scriptURL.match(/https?:\/\/([^:\/]+)/);
        if (match && match[1]) {
          const ip = match[1];
          if (ip !== "localhost" && ip !== "127.0.0.1") {
            const apiUrl = `http://${ip}:${BACKEND_PORT}`;
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
            return apiUrl;
          }
        }
      }
    } catch {}
    return `http://localhost:${BACKEND_PORT}`;
  }

  // Fallback for when auto-detection fails
  const fallbackIp = Platform.OS === "android" ? "10.0.2.2" : "localhost";
  const fallbackUrl = `http://${fallbackIp}:${BACKEND_PORT}`;
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
