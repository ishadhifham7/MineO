#!/usr/bin/env node

/**
 * Backend Connection Tester
 * 
 * This script tests the connection to your backend server and helps
 * diagnose network issues.
 * 
 * Usage:
 *   node scripts/test-backend-connection.js
 *   node scripts/test-backend-connection.js 192.168.1.100
 */

const http = require('http');
const os = require('os');

// Get custom IP from command line or detect automatically
const customIP = process.argv[2];
const BACKEND_PORT = 3001;

/**
 * Get all network interfaces and their IP addresses
 */
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push({
          name,
          address: iface.address,
          netmask: iface.netmask
        });
      }
    }
  }
  
  return ips;
}

/**
 * Test connection to backend server
 */
function testConnection(ip, port) {
  return new Promise((resolve) => {
    const options = {
      hostname: ip,
      port: port,
      path: '/api/v1/health',
      method: 'GET',
      timeout: 5000
    };

    console.log(`\n🔍 Testing connection to http://${ip}:${port}...`);

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ SUCCESS! Server is reachable at http://${ip}:${port}`);
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Response:`, data);
          resolve(true);
        } else {
          console.log(`⚠️  Server responded but with status ${res.statusCode}`);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ FAILED to connect to http://${ip}:${port}`);
      console.log(`   Error: ${error.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`⏱️  TIMEOUT after 5 seconds`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

/**
 * Main function
 */
async function main() {
  console.log('========================================');
  console.log('🌐 Backend Connection Tester');
  console.log('========================================\n');

  const localIPs = getLocalIPs();

  console.log('📍 Your computer\'s network interfaces:');
  console.log('========================================');
  localIPs.forEach((ip, index) => {
    console.log(`${index + 1}. ${ip.name}: ${ip.address}`);
  });
  console.log('');

  if (customIP) {
    // Test custom IP
    console.log(`\n🎯 Testing custom IP: ${customIP}\n`);
    const success = await testConnection(customIP, BACKEND_PORT);
    
    if (success) {
      console.log('\n✅ CONFIGURATION:');
      console.log(`   Add to client/.env:`);
      console.log(`   EXPO_PUBLIC_API_URL=http://${customIP}:${BACKEND_PORT}`);
    }
  } else {
    // Test all local IPs
    console.log('\n🔍 Testing all network interfaces...\n');
    
    for (const ip of localIPs) {
      await testConnection(ip.address, BACKEND_PORT);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
    }

    const workingIP = localIPs[0]?.address;
    if (workingIP) {
      console.log('\n💡 RECOMMENDED CONFIGURATION:');
      console.log(`   If none worked, verify backend is running:`);
      console.log(`   cd server && npm run dev`);
      console.log(`\n   Your most likely IP: ${workingIP}`);
      console.log(`   Test manually: http://${workingIP}:${BACKEND_PORT}/api/v1/health`);
    }
  }

  console.log('\n========================================');
  console.log('📋 TROUBLESHOOTING CHECKLIST:');
  console.log('========================================');
  console.log('□ Backend server is running (cd server && npm run dev)');
  console.log('□ Backend is listening on port 3001');
  console.log('□ Firewall allows connections on port 3001');
  console.log('□ Both devices are on the same WiFi network');
  console.log('□ WiFi is not in "Isolation Mode" (public WiFi issue)');
  console.log('□ Antivirus is not blocking connections');
  console.log('========================================\n');
}

main().catch(console.error);
