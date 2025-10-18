/**
 * API Configuration
 * 
 * IMPORTANT: When connecting to a different WiFi network, update the IP address below.
 * 
 * To find your new IP address:
 * - Windows: Run `ipconfig` in Command Prompt
 * - Mac/Linux: Run `ifconfig` in Terminal
 * - Look for your WiFi adapter's IPv4 Address
 * 
 * Example: 192.168.1.100, 192.168.0.105, etc.
 */

// ⚠️ UPDATE THIS IP ADDRESS WHEN CHANGING WIFI NETWORKS
const LOCAL_IP = '192.168.8.118';

// API Base URL - automatically uses the IP above
export const API_BASE_URL = `http://${LOCAL_IP}/api`;

// Alternative: Use localhost for Android emulator
// export const API_BASE_URL = 'http://10.0.2.2/api';

// Alternative: Use localhost for iOS simulator
// export const API_BASE_URL = 'http://localhost/api';

/**
 * Quick Setup Guide:
 * 
 * 1. Find your computer's IP address on the new WiFi
 * 2. Update LOCAL_IP above with the new IP
 * 3. Restart Expo: npx expo start --clear
 * 4. Reload the app
 * 
 * That's it! All API calls will use the new IP.
 */
