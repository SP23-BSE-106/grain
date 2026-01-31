'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

const protectedRoutes = ['/shop', '/product', '/cart', '/orders', '/profile', '/checkout', '/admin'];

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isHydrated, user, setHydrated } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check on public routes
      const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

      if (isProtectedRoute) {
        // First check if user is already in store (avoid unnecessary API calls)
        if (user) {
          setHydrated();
          return;
        }

        // Check for token in cookies first
        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(';').shift();
        };

        const token = getCookie('accessToken');

        if (!token) {
          // No token, redirect to login
          router.push(`/login?redirect=${pathname}`);
          return;
        }

        // Verify auth with API call only if we have a token but no user in store
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
          console.error('Failed to verify auth:', error);
        }

        // No valid auth, redirect to login
        router.push(`/login?redirect=${pathname}`);
      } else {
        setHydrated();
      }
    };

    if (!isHydrated && typeof window !== 'undefined') {
      checkAuth().catch((error) => {
        console.error('Auth check failed:', error);
        setHydrated();
      });
    }
  }, [isHydrated, pathname, router, setHydrated]);

  return <>{children}</>;
}
