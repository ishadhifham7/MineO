/**
 * Debug utility to inspect Expo Constants
 * Import this in your app to see all available properties
 *
 * Usage: import './utils/debug-constants'; at the top of your app
 */

import Constants from "expo-constants";
import { Platform } from "react-native";

console.log("\n========================================");
console.log("🔍 EXPO CONSTANTS DEBUG");
console.log("========================================\n");

console.log("Platform:", Platform.OS);
console.log("__DEV__:", __DEV__);

console.log("\n--- Constants.expoConfig ---");
console.log(JSON.stringify(Constants.expoConfig, null, 2));

console.log("\n--- Constants.manifest ---");
console.log(JSON.stringify((Constants as any).manifest, null, 2));

console.log("\n--- Constants.manifest2 ---");
console.log(JSON.stringify(Constants.manifest2, null, 2));

console.log("\n--- Global variables ---");
console.log("location.href:", (global as any).location?.href);
console.log("serverURL:", (Platform as any).__constants?.serverURL);
console.log("linkingUri:", (Constants as any).linkingUri);

console.log("\n========================================\n");
