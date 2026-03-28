import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiFetch } from "../api/http";
import { useAuth } from "./AuthProvider";

export type UserProfile = {
  uid: string;
  name?: string;
  email?: string;
  username?: string;
  bio?: string;
  phoneNumber?: string;
  birthday?: string;
  gender?: string;
  country?: string;
  showEmail?: boolean;
  showPhone?: boolean;
  activityTracking?: boolean;
  dataSharing?: boolean;
  photoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

type UpdateUserProfileBody = Partial<
  Pick<
    UserProfile,
    | "name"
    | "username"
    | "bio"
    | "phoneNumber"
    | "birthday"
    | "gender"
    | "country"
    | "showEmail"
    | "showPhone"
    | "activityTracking"
    | "dataSharing"
    | "photoUrl"
  >
>;

type ProfileContextValue = {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: UpdateUserProfileBody) => Promise<void>;
  clearProfile: () => void;
};

const ProfileContext = createContext<ProfileContextValue | undefined>(
  undefined,
);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth(); // should become true after login
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ profile: UserProfile }>("/users/me", {
        method: "GET",
      });
      setProfile(res.profile);
    } catch (e: any) {
      setError(e.message || "Failed to load profile");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: UpdateUserProfileBody) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ profile: UserProfile }>("/users/me", {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
      setProfile(res.profile);
    } catch (e: any) {
      setError(e.message || "Failed to update profile");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const clearProfile = () => {
    setProfile(null);
    setError(null);
    setLoading(false);
  };

  // Auto-load when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshProfile();
    } else {
      clearProfile();
    }
  }, [isAuthenticated]);

  const value = useMemo(
    () => ({
      profile,
      loading,
      error,
      refreshProfile,
      updateProfile,
      clearProfile,
    }),
    [profile, loading, error],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
