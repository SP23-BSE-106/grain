'use client';

import { useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const { isHydrated, user, setHydrated } = useAuthStore();

  useEffect(() => {
    // Only populate user data if we have a token but no user in store
    // Authentication and redirects are handled by middleware
    const populateUser = async () => {
      if (user) {
        setHydrated();
        return;
      }

      // Check for token in cookies
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
      };

      const token = getCookie('accessToken');

      if (token) {
        // Try to get user data from API
        try {
          const response = await fetch('/api/auth/me', {
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            if (data.user) {
              useAuthStore.setState({
                user: data.user,
                isHydrated: true,
              });
              return;
            }
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }

      // No user data available, just set hydrated
      setHydrated();
    };

    if (!isHydrated && typeof window !== 'undefined') {
      populateUser().catch((error) => {
        console.error('User population failed:', error);
        setHydrated();
      });
    }
  }, [isHydrated, pathname, setHydrated, user]);

  return <>{children}</>;
}
