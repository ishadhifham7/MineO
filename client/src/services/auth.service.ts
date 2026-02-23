import { API_BASE_URL } from "./api";
import { saveToken, removeToken } from "../utils/tokenStorage";

// Sends user data to the backend - user signup

export const signupUser = async (data: {
    name: string;
    email: string;
    password: string;
    dob: string;

}) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
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
};



// ======================= user login =============================

export const loginUser = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
};



// User logout & remove stored token

export const logoutUser = async () => {
  await removeToken();
};

