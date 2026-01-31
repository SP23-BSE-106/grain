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
      login: (user, token) => set({ user, token, isHydrated: true }),
      logout: () => set({ user: null, token: null }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          // Check for token in cookies and fetch user data from API
          const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
          };
          
          const cookieToken = getCookie('accessToken');
          if (cookieToken && !state.user) {
            // Fetch user data from the API endpoint
            fetch('/api/auth/me')
              .then((res) => res.json())
              .then((data) => {
                if (data.user) {
                  state.login(data.user, cookieToken);
                } else {
                  state.setHydrated();
                }
              })
              .catch((error) => {
                console.error('Failed to fetch user data:', error);
                state.setHydrated();
              });
          } else {
            state.setHydrated();
          }
        }
      },
    }
  )
);
