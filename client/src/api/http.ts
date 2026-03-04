import { getToken } from "../utils/tokenStorage";
import { env } from "../../constants/env";
/*
    Automatically attaches Authorization: Bearer <token>
    Uses custom auth token stored in token storage.
*/

const API_BASE_URL = env.API_BASE_URL;

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg =
      data?.error || data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}

/**
 * Multipart/form-data upload helper.
 * Do NOT set Content-Type manually — fetch sets it with the correct boundary.
 */
export async function apiFetchFormData<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const token = await getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    body: formData,
    headers: {
      // No Content-Type here; fetch sets multipart/form-data with boundary automatically
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = data?.error || data?.message || `Upload failed (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}
