export interface SiteSettings {
  name: string;
  description: string;
  logoUrl: string;
}

export interface User {
  id: string;
  email: string;
  referralCode: string;
  referredBy: string | null;
  referralCount: number;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface App {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppUser {
  id: string;
  appId: string;
  email: string;
  createdAt: string;
}
