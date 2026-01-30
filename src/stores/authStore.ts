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
  token: string | null;
  isHydrated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isHydrated: false,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => {
        // Use sessionStorage in production to avoid localStorage issues on Vercel
        if (typeof window !== 'undefined') {
          return sessionStorage;
        }
        return localStorage;
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Check for token in cookies and decode to set user
          if (typeof window !== 'undefined') {
            const getCookie = (name: string) => {
              const value = `; ${document.cookie}`;
              const parts = value.split(`; ${name}=`);
              if (parts.length === 2) return parts.pop()?.split(';').shift();
            };
            const cookieToken = getCookie('accessToken');
            if (cookieToken && !state.user) {
              try {
                const payload = cookieToken.split('.')[1];
                const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
                state.login(decoded, cookieToken);
              } catch (e) {
                console.error('Failed to decode token from cookie:', e);
              }
            }
          }
          state.setHydrated();
        }
      },
    }
  )
);
