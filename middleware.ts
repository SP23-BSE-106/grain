import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  console.log('Middleware: JWT_ACCESS_SECRET set:', !!process.env.JWT_ACCESS_SECRET);
  const { pathname } = request.nextUrl;

  // Define protected routes (require login)
  const protectedRoutes: string[] = ['/shop', '/product', '/cart', '/orders', '/profile', '/checkout'];

  // Define admin-only routes
  const adminRoutes: string[] = ['/admin'];

  // Check if the current path is protected
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdmin = adminRoutes.some(route => pathname.startsWith(route));

  if (isProtected || isAdmin) {
    const token = request.cookies.get('accessToken')?.value;
    console.log('Middleware: Token present:', !!token);

    if (!token) {
      // No token, redirect to login with redirect param
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const decoded = verifyToken(token);
    console.log('Middleware: Decoded valid:', !!decoded, decoded?.role);
    if (!decoded) {
      // Invalid token, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdmin && decoded.role !== 'admin') {
      // Not admin, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|signup|$).*)'],
};
