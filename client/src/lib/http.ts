import axios, { AxiosInstance } from "axios";
import { env } from "../../constants/env";
import { getToken } from "../utils/tokenStorage";

/**
 * Configured Axios HTTP Client
 *
 * This is a centralized HTTP client for making API requests.
 * It includes the base URL and can be extended with interceptors
 * for authentication, error handling, etc.
 */
export const httpClient: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 30000, // 30 seconds - increased for slow networks
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 * Automatically adds JWT token to Authorization header
 */
httpClient.interceptors.request.use(
  async (config) => {
    // Get JWT token from AsyncStorage
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor
 * Handle common errors here
 */
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging
    if (error.response) {
      // Server responded with error status
      console.error("❌ API Error:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      // Request made but no response received
      console.error("❌ No response from server. Backend URL:", env.API_BASE_URL);
      console.error("❌ Please ensure the backend server is running on port 3001");
      error.message = "Network error: Cannot reach server. Please check if backend is running.";
    } else {
      // Something else happened
      console.error("❌ Request Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default httpClient;
