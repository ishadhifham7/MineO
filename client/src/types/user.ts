// User Type Definitions

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  bio?: string;
  profilePhoto?: string;
  phoneNumber?: string;
  birthday?: string;
  gender?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: "trophy" | "star" | "award" | "target" | string;
  unlockedAt?: string;
  progress?: number;
  total?: number;
}

export interface UserProfile extends User {
  achievements?: Achievement[];
  settings?: UserSettings;
}

export interface UserSettings {
  activityStatus: "Active" | "Away" | "Offline";
  theme: "Light" | "Dark" | "Auto";
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
  privacy: {
    showEmail: boolean;
    showPhone: boolean;
    profileVisibility: "Public" | "Private" | "Friends";
    activityTracking: boolean;
    dataSharing: boolean;
  };
}
