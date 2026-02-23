import axios, { AxiosInstance } from "axios";
import { env } from "../../constants/env";

/**
 * Configured Axios HTTP Client
 *
 * This is a centralized HTTP client for making API requests.
 * It includes the base URL and can be extended with interceptors
 * for authentication, error handling, etc.
 */
export const httpClient: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 * Add authentication tokens here if needed
 */
httpClient.interceptors.request.use(
  (config) => {
    // TODO: Add auth token if needed
    // const token = await getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
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
      console.error("API Error:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      // Request made but no response received
      console.error("Network Error: No response from server", {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
      console.error("Make sure the backend server is running and accessible");
    } else {
      // Something else happened
      console.error("Request Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default httpClient;
