import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log('🔒 MIDDLEWARE: Processing request for path:', pathname);

  // Define protected routes (require login)
  const protectedRoutes: string[] = ['/shop', '/product', '/cart', '/orders', '/profile', '/checkout'];

  // Define admin-only routes
  const adminRoutes: string[] = ['/admin'];

  // Check if the current path is protected
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdmin = adminRoutes.some(route => pathname.startsWith(route));

  console.log('🔒 MIDDLEWARE: isProtected:', isProtected, 'isAdmin:', isAdmin);

  if (isProtected || isAdmin) {
    const token = request.cookies.get('accessToken')?.value;
    console.log('🔒 MIDDLEWARE: Token present:', !!token);

    if (!token) {
      // No token, redirect to login with redirect param
      console.log('🔒 MIDDLEWARE: No token found, redirecting to login');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const decoded = verifyToken(token);
    console.log('🔒 MIDDLEWARE: Token verification result:', !!decoded);
    if (decoded) {
      console.log('🔒 MIDDLEWARE: Decoded token:', { id: decoded.id, role: decoded.role });
    }

    if (!decoded) {
      // Invalid token, redirect to login
      console.log('🔒 MIDDLEWARE: Invalid token, redirecting to login');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdmin && decoded.role !== 'admin') {
      // Not admin, redirect to home
      console.log('🔒 MIDDLEWARE: Non-admin trying to access admin route, redirecting to home');
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  console.log('🔒 MIDDLEWARE: Allowing request to proceed');
  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/shop', '/product/:path*', '/cart', '/orders/:path*', '/profile', '/checkout/:path*', '/admin/:path*'],
};
