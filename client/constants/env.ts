/**
 * Environment Configuration
 *
 * IMPORTANT: For React Native development:
 * - DO NOT use 'localhost' - it refers to the device/emulator itself
 * - Use your machine's local IP address instead
 * - Find your IP: Run 'ipconfig' (Windows) or 'ifconfig' (Mac/Linux)
 *
 * Example IPs:
 * - WiFi: 192.168.x.x
 * - Ethernet: Usually starts with 10.x.x.x or 192.168.x.x
 */

// Get your machine's IP address by running: ipconfig (Windows) or ifconfig (Mac/Linux)
// Replace this with your actual IP address
const MACHINE_IP = "192.168.1.103"; // Update this if your IP changes

export const env = {
  API_BASE_URL: `http://${MACHINE_IP}:3001/api/v1`,
} as const;
