// src/services/api.ts
import axios from "axios";
import { env } from "../../constants/env";
import { getToken } from "../utils/tokenStorage";

/**
 * Journal API Client
 * Uses auto-detected backend URL - works on any network!
 */
export const API_BASE_URL = env.API_BASE_URL;

// Base URL for journal API
const getBaseURL = () => {
  return `${env.API_BASE_URL}/journal`;
};

export const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor - Automatically adds JWT token to Authorization header
api.interceptors.request.use(
  async (config) => {
    // Get JWT token from AsyncStorage and add to headers
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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);
