export interface UserProfile {
  email: string;
  token: string;
}

export interface UserState {
  isAuthenticated: boolean;
  profile?: UserProfile;
}
