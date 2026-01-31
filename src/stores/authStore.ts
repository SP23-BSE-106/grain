import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isHydrated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  (set, get) => ({
    user: null,
    isHydrated: false,
    login: (user: User) => set({ user, isHydrated: true }),
    logout: () => set({ user: null }),
    setHydrated: () => set({ isHydrated: true }),
  })
);


