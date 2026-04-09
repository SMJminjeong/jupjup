import type { User } from '@jupjup/types';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  setSession: (user: User, token: string) => void;
  clear: () => void;
  setLoading: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: false,
  setSession: (user, token) => set({ user, accessToken: token }),
  clear: () => set({ user: null, accessToken: null }),
  setLoading: (v) => set({ isLoading: v }),
}));
