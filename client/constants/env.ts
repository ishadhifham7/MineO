/**
 * Environment Configuration
 *
 * IMPORTANT: For React Native development:
 * - DO NOT use 'localhost' - it refers to the device/emulator itself
 * - Use your machine's local IP address instead
 * - Set EXPO_PUBLIC_API_URL in .env file
 */

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.103:3001";

export const env = {
  API_BASE_URL: `${API_URL}/api/v1`,
} as const;
