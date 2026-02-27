/**
 * IP Detection Tester
 * Run this to verify auto-detection is working
 *
 * Usage: node scripts/test-ip-detection.js
 */

const { execSync } = require("child_process");

console.log("\n🔍 Testing IP Auto-Detection\n");

// Get computer's IP address
try {
  const os = require("os");
  const interfaces = os.networkInterfaces();

  let ipAddress = null;
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === "IPv4" && !iface.internal) {
        ipAddress = iface.address;
        console.log(`✅ Found IP: ${ipAddress} (${name})`);
      }
    }
  }

  if (!ipAddress) {
    console.error("❌ No network IP found - are you connected to WiFi?");
    process.exit(1);
  }

  console.log(`\n📡 Backend should be accessible at: http://${ipAddress}:3001`);
  console.log(`\n💡 When you start Expo, it will auto-detect this IP!\n`);
} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}
