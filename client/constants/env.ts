// Environment configuration
// Prefer Expo public var `EXPO_PUBLIC_API_URL`, then `process.env.BACKEND_IP`,
// then global override `__BACKEND_IP__`, then platform default (android emulator -> 10.0.2.2, else localhost).
import { Platform } from "react-native";

const BACKEND_PORT = process.env.BACKEND_PORT || "3001";
const DEFAULT_HOST = Platform.OS === "android" ? "10.0.2.2" : "localhost";

// If EXPO_PUBLIC_API_URL is provided use it directly (it may include protocol and port)
const EXPO_URL = (typeof process !== "undefined" && process.env?.EXPO_PUBLIC_API_URL) || undefined;

const hostFromEnv = (typeof process !== "undefined" && process.env?.BACKEND_IP)
  ? `http://${process.env.BACKEND_IP}:${BACKEND_PORT}`
  : (global as any).__BACKEND_IP__
  ? `http://${(global as any).__BACKEND_IP__}:${BACKEND_PORT}`
  : `http://${DEFAULT_HOST}:${BACKEND_PORT}`;

const API_URL = EXPO_URL || hostFromEnv;

export const env = {
  API_BASE_URL: `${API_URL}/api/v1`,
  API_URL,
};
