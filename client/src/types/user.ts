export type ActivityStatus = "Active" | "Away" | "Offline";

export interface Achievement {
  id: string;
  icon: "trophy" | "star" | "award" | "target";
  title: string;
  earned: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  avatarUrl: string | null;
  followers: number;
  following: number;
  activityStatus: ActivityStatus;
  achievements: Achievement[];
}
