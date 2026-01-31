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

  console.log('🔐 AUTH_PROVIDER: Component render - pathname:', pathname, 'isHydrated:', isHydrated, 'user:', !!user);

  useEffect(() => {
    console.log('🔐 AUTH_PROVIDER: useEffect triggered - isHydrated:', isHydrated, 'pathname:', pathname, 'user:', !!user);

    // Only populate user data if we have a token but no user in store
    // Authentication and redirects are handled by middleware
    const populateUser = async () => {
      console.log('🔐 AUTH_PROVIDER: populateUser called');

      if (user) {
        console.log('🔐 AUTH_PROVIDER: User already exists in store, setting hydrated');
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
      console.log('🔐 AUTH_PROVIDER: Token from cookies:', !!token);

      if (token) {
        console.log('🔐 AUTH_PROVIDER: Token found, calling /api/auth/me...');
        // Try to get user data from API
        try {
          const response = await fetch('/api/auth/me', {
            credentials: 'include',
          });
          console.log('🔐 AUTH_PROVIDER: /api/auth/me response status:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('🔐 AUTH_PROVIDER: /api/auth/me response data:', data);

            if (data.user) {
              console.log('🔐 AUTH_PROVIDER: Setting user in store:', data.user);
              useAuthStore.setState({
                user: data.user,
                isHydrated: true,
              });
              return;
            } else {
              console.log('🔐 AUTH_PROVIDER: No user data in response');
            }
          } else {
            console.log('🔐 AUTH_PROVIDER: /api/auth/me failed with status:', response.status);
          }
        } catch (error) {
          console.error('🔐 AUTH_PROVIDER: Failed to fetch user data:', error);
        }
      } else {
        console.log('🔐 AUTH_PROVIDER: No token found in cookies');
      }

      console.log('🔐 AUTH_PROVIDER: No user data available, setting hydrated');
      // No user data available, just set hydrated
      setHydrated();
    };

    if (!isHydrated && typeof window !== 'undefined') {
      console.log('🔐 AUTH_PROVIDER: Running populateUser...');
      populateUser().catch((error) => {
        console.error('🔐 AUTH_PROVIDER: User population failed:', error);
        setHydrated();
      });
    } else {
      console.log('🔐 AUTH_PROVIDER: Skipping populateUser - isHydrated:', isHydrated, 'window defined:', typeof window !== 'undefined');
    }
  }, [isHydrated, pathname, setHydrated, user]);

  return <>{children}</>;
}
