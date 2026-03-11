const { spawn } = require("child_process");
const os = require("os");
const path = require("path");

const useLan = !process.argv.includes("--no-lan");

// Get the real Wi-Fi IP.
// On Windows there are often virtual adapters (VirtualBox, VMware, WSL, Hyper-V)
// that appear before the real Wi-Fi adapter. We prefer interfaces whose name
// contains "wi-fi" or "wlan", then fall back to the first non-virtual one,
// then to any non-loopback address as a last resort.
function getNetworkIP() {
  const interfaces = os.networkInterfaces();
  const candidates = [];

  for (const [name, addrs] of Object.entries(interfaces)) {
    for (const iface of addrs) {
      if (iface.family !== "IPv4" || iface.internal) continue;
      const lower = name.toLowerCase();
      // Skip known virtual/VPN adapters
      if (
        lower.includes("virtualbox") ||
        lower.includes("vmware") ||
        lower.includes("vethernet") ||
        lower.includes("hyper-v") ||
        lower.includes("wsl") ||
        lower.includes("loopback") ||
        lower.includes("vpn") ||
        lower.includes("tap")
      )
        continue;

      const isWifi =
        lower.includes("wi-fi") ||
        lower.includes("wifi") ||
        lower.includes("wlan") ||
        lower.includes("wireless");

      candidates.push({ ip: iface.address, isWifi, name });
    }
  }

  // Prefer Wi-Fi adapters
  const wifi = candidates.find((c) => c.isWifi);
  if (wifi) return wifi.ip;
  // Fall back to first surviving candidate
  if (candidates[0]) return candidates[0].ip;
  return "localhost";
}

// Test whether api.expo.dev is reachable over real HTTPS (3-second timeout).
// A plain TCP connect can succeed while TLS/proxy fails, so we use https.get.
// Expo CLI fetches from this host to validate dependencies; if unreachable
// we add --offline so the CLI doesn't crash.
function checkExpoConnectivity() {
  return new Promise((resolve) => {
    const https = require("https");
    const req = https.get(
      { host: "api.expo.dev", path: "/", timeout: 3000 },
      (res) => {
        res.destroy();
        resolve(true);
      },
    );
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function main() {
  const isOnline = await checkExpoConnectivity();

  const expoArgs = ["expo", "start", "--clear"];

  // Always resolve and set the correct LAN IP so the QR code points to a
  // reachable address — even when --no-lan is used (npm start).
  const ip = getNetworkIP();
  process.env.REACT_NATIVE_PACKAGER_HOSTNAME = ip;
  process.env.EXPO_DEVTOOLS_LISTEN_ADDRESS = "0.0.0.0";

  // Always force --lan so Expo uses REACT_NATIVE_PACKAGER_HOSTNAME.
  // Without this flag, Expo ignores the env var and picks its own address.
  expoArgs.push("--lan");

  if (useLan) {
    console.log(`\n📱 Starting Expo on network IP: ${ip}`);
    console.log(`🎯 Scan the QR code with your Expo Go app`);
    console.log(`📍 Make sure your phone is on the same WiFi network\n`);
  } else {
    console.log(`\n📱 Metro will be reachable at: ${ip}:8081`);
  }

  if (!isOnline) {
    console.warn(
      "⚠️  Cannot reach api.expo.dev — starting in offline mode (dependency validation skipped).\n",
    );
    expoArgs.push("--offline");
  }

  // Prepend local node_modules/.bin to PATH so the bundled Expo CLI
  // (not a globally installed expo-cli) is always used.
  const localBin = path.join(__dirname, "node_modules", ".bin");
  process.env.PATH = `${localBin}${path.delimiter}${process.env.PATH || ""}`;

  const expo = spawn("npx", expoArgs, {
    env: process.env,
    stdio: "inherit",
    shell: true,
    cwd: __dirname,
  });

  expo.on("close", (code) => process.exit(code));
}

main();
