import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/admin'];

  // Check if the current path is protected
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected) {
    const token = request.cookies.get('accessToken')?.value;
    console.log('Middleware: Token present:', !!token);

    if (!token) {
      // No token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const decoded = verifyToken(token);
    console.log('Middleware: Decoded valid:', !!decoded, decoded?.role);
    if (!decoded || decoded.role !== 'admin') {
      // Invalid token or not admin, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
