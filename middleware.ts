import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Step 1: Define protected routes (only /admin and its subpaths)
  const protectedRoutes = ['/admin'];

  // Step 2: Check if the current path is protected
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected) {
    // Step 3: Retrieve the HTTP-only cookie named "token"
    // This cookie is set during login and contains the JWT token
    const token = request.cookies.get('token')?.value;

    // Step 4: If no token is present, redirect to /login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Step 5: Verify the token by calling the /api/verifyToken endpoint
    // This ensures proper validation and works reliably on Vercel
    try {
      const verifyResponse = await fetch(new URL('/api/verifyToken', request.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (!verifyResponse.ok) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      const verifyData = await verifyResponse.json();
      if (!verifyData.valid || verifyData.user?.role !== 'admin') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Step 7: Allow the request to proceed if not protected or authenticated
  return NextResponse.next();
}

// Configuration for the middleware matcher
// This ensures the middleware only runs on /admin routes and subpaths
export const config = {
  matcher: ['/admin/:path*'],
};
