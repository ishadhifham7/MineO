// src/services/journey.service.ts
import axios from "axios";
import { env } from "../../constants/env";
import { getToken } from "../utils/tokenStorage";

export interface JourneyNode {
  id: string;
  date: string;
  title?: string;
  updatedAt: number;
}

// Create journey-specific API client
const journeyApi = axios.create({
  baseURL: `${env.API_BASE_URL}/journey`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add auth token to requests
journeyApi.interceptors.request.use(
  async (config) => {
    console.log('🔵 Journey API Request:', config.method?.toUpperCase(), config.url);
    const token = await getToken();
    if (token) {
      console.log('🔑 Token found, adding to Authorization header');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No token found in storage!');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
journeyApi.interceptors.response.use(
  (response) => {
    console.log('✅ Journey API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('❌ Response Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('❌ No Response - Is backend running?');
    } else {
      console.error('❌ Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const JourneyApi = {
  async getTimeline(): Promise<JourneyNode[]> {
    const response = await journeyApi.get("/timeline");
    return response.data;
  },
};
