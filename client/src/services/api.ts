// src/services/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api/v1/journal",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});
