import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { getToken, removeToken } from "../utils/tokenStorage";

/* ========================= */
/*        INTERFACES         */
/* ========================= */

/**
 * Decoded JWT payload structure from backend
 */
interface TokenPayload {
  userId: string;
  email: string;
  exp: number;
}

/**
 * Authenticated user data
 */
export interface AuthUser {
  userId: string;
  email: string;
}

/**
 * Auth Context Type
 */
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

/* ========================= */
/*       CONTEXT INIT        */
/* ========================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ========================= */
/*       PROVIDER            */
/* ========================= */

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load and decode JWT from AsyncStorage
   */
  const loadUserFromToken = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await getToken();

      if (!token) {
        // No token found - user not logged in
        setUser(null);
        return;
      }

      // Decode JWT
      const decoded = jwtDecode<TokenPayload>(token);

      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        console.warn("⚠️ Token expired, clearing storage");
        await removeToken();
        setUser(null);
        setError("Session expired. Please login again.");
        return;
      }

      // Set authenticated user
      setUser({
        userId: decoded.userId,
        email: decoded.email,
      });

      console.log("✅ User authenticated:", decoded.userId);
    } catch (err) {
      console.error("❌ Auth error:", err);
      setError("Failed to authenticate. Please login again.");
      setUser(null);
      // Clear invalid token
      await removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh authentication state (useful after login/signup)
   */
  const refreshAuth = async (): Promise<void> => {
    await loadUserFromToken();
  };

  /**
   * Logout user and clear token
   */
  const logout = async (): Promise<void> => {
    await removeToken();
    setUser(null);
    setError(null);
    console.log("🔓 User logged out");
  };

  // Load user on mount
  useEffect(() => {
    loadUserFromToken();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    error,
    refreshAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ========================= */
/*       CUSTOM HOOK         */
/* ========================= */

/**
 * Hook to access auth context
 * @throws Error if used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
