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
  persist(
    (set, get) => ({
      user: null,
      isHydrated: false,
      login: (user: User) => set({ user, isHydrated: true }),
      logout: () => set({ user: null }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          // Fetch user data from the API endpoint with credentials
          fetch('/api/auth/me', {
            credentials: 'include',
          })
            .then((res) => {
              if (!res.ok) throw new Error('Failed to fetch user');
              return res.json();
            })
            .then((data) => {
              if (data.user) {
                state.login(data.user);
              } else {
                state.setHydrated();
              }
            })
            .catch((error) => {
              console.error('Failed to fetch user data:', error);
              state.setHydrated();
            });
        }
      },
    }
  )
);
