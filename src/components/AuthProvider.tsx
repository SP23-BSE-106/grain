'use client';

import { useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const { isHydrated } = useAuthStore();

  console.log('🔐 AUTH_PROVIDER: Component render - pathname:', pathname, 'isHydrated:', isHydrated, 'user:', !!useAuthStore.getState().user);

  useEffect(() => {
    console.log('🔐 AUTH_PROVIDER: useEffect triggered - isHydrated:', isHydrated, 'pathname:', pathname, 'user:', !!useAuthStore.getState().user);

    // Only populate user data if we have a token but no user in store
    // Authentication and redirects are handled by middleware
    const populateUser = async () => {
      console.log('🔐 AUTH_PROVIDER: populateUser called');

      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        console.log('🔐 AUTH_PROVIDER: User already exists in store, setting hydrated');
        useAuthStore.setState({ isHydrated: true });
        return;
      }

      console.log('🔐 AUTH_PROVIDER: Calling /api/auth/me to check authentication...');
      // Try to get user data from API (cookies are sent automatically with credentials: 'include')
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

      console.log('🔐 AUTH_PROVIDER: No user data available, setting hydrated');
      // No user data available, just set hydrated
      useAuthStore.setState({ isHydrated: true });
    };

    if (!isHydrated && typeof window !== 'undefined') {
      console.log('🔐 AUTH_PROVIDER: Running populateUser...');
      populateUser().catch((error) => {
        console.error('🔐 AUTH_PROVIDER: User population failed:', error);
        useAuthStore.setState({ isHydrated: true });
      });
    } else {
      console.log('🔐 AUTH_PROVIDER: Skipping populateUser - isHydrated:', isHydrated, 'window defined:', typeof window !== 'undefined');
    }
  }, [isHydrated]);

  return <>{children}</>;
}
