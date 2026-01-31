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

      if (isProtectedRoute && !user) {
        // Try to restore from API
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
          console.error('Failed to restore auth:', error);
        }

        // No valid auth, redirect to login
        router.push(`/login?redirect=${pathname}`);
      } else {
        setHydrated();
      }
    };

    if (!isHydrated && typeof window !== 'undefined') {
      checkAuth();
    }
  }, [isHydrated, user, pathname, router, setHydrated]);

  return <>{children}</>;
}
