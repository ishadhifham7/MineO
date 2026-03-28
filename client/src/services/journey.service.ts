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

// Response interceptor for debugging
journeyApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const JourneyApi = {
  async getTimeline(): Promise<JourneyNode[]> {
    const response = await journeyApi.get("/timeline");
    return response.data;
  },
};
