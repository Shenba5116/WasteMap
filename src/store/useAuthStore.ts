import { create } from 'zustand';

export interface User {
  id: string;
  email?: string;
}

export interface Profile {
  id: string;
  role: 'citizen' | 'cleaner' | 'admin';
  full_name?: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
}));
