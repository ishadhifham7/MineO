const { spawn } = require("child_process");
const os = require("os");
const path = require("path");

// Get network IP
function getNetworkIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

const ip = getNetworkIP();
console.log(`\n📱 Starting Expo on network IP: ${ip}\n`);
console.log(`🎯 Scan the QR code with your Expo Go app`);
console.log(`📍 Make sure your phone is on the same WiFi network\n`);

const env = {
  ...process.env,
  REACT_NATIVE_PACKAGER_HOSTNAME: ip,
  EXPO_DEVTOOLS_LISTEN_ADDRESS: "0.0.0.0",
};

// Make sure we're in the correct directory
const clientDir = __dirname;

const expo = spawn("npx", ["expo", "start", "--clear", "--lan"], {
  env,
  stdio: "inherit",
  shell: true,
  cwd: clientDir, // Set working directory to client folder
});

expo.on("close", (code) => {
  process.exit(code);
});
