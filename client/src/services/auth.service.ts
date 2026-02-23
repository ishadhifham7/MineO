import { API_BASE_URL } from "./api";
import { saveToken, removeToken } from "../utils/tokenStorage";

// Sends user data to the backend - user signup

export const signupUser = async (data: {
    name: string;
    email: string;
    password: string;
    dob: string;

}) => {
    const url = `${API_BASE_URL}/api/v1/auth/signup`;
    console.log("[auth] signup URL:", url);
    try {
    const response = await fetch(url, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Signup failed");
  }

  return result;
    } catch (err: any) {
      console.error("[auth] signup error for URL:", url, err?.message || err);
      throw err;
    }
};



// ======================= user login =============================

export const loginUser = async (email: string, password: string) => {
  const url = `${API_BASE_URL}/api/v1/auth/login`;
  console.log("[auth] login URL:", url);
  try {
  const response = await fetch(url, {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Login failed");
  }

  // save JWT token locally
  if (result.token) {
  await saveToken(result.token);
  }

  return result;
  } catch (err: any) {
    console.error("[auth] login error for URL:", url, err?.message || err);
    throw err;
  }
};



// User logout & remove stored token

export const logoutUser = async () => {
  await removeToken();
};

