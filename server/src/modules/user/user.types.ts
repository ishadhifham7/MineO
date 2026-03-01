export type UserProfile = {
  uid: string; // auth uid (from token)
  name?: string;
  email?: string;

  // extra profile fields used in the Profile screen
  username?: string;
  bio?: string;
  phoneNumber?: string;
  birthday?: string; 
  gender?: string;
  country?: string;

  // privacy / settings (profile.tsx has these toggles as local state)
  showEmail?: boolean;
  showPhone?: boolean;
  activityTracking?: boolean;
  dataSharing?: boolean;

  photoUrl?: string;

  createdAt?: string;
  updatedAt?: string;
};

// Only allow updating these fields from the client.
export type UpdateUserProfileBody = Partial<
  Pick<
    UserProfile,
    | "name"
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