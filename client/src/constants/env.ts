import { Platform } from "react-native";

const BACKEND_PORT = "3001";
const DEFAULT_DEV_IP = Platform.OS === "android" ? "10.0.2.2" : "localhost";
const BACKEND_IP = (typeof process !== "undefined" && process.env?.BACKEND_IP) || (global as any).__BACKEND_IP__ || DEFAULT_DEV_IP;

export const API_BASE_URL = (typeof process !== "undefined" && process.env?.API_BASE_URL)
  ? process.env.API_BASE_URL
  : `http://${BACKEND_IP}:${BACKEND_PORT}`;
