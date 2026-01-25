import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// TypeScript interface for the decoded JWT payload
interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

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

    // Step 5: Verify the token using the verifyToken function
    // This checks if the token is valid and not expired
    const decoded = verifyToken(token) as DecodedToken | null;

    // Step 6: If token is invalid or user is not an admin, redirect to /login
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Optional: For extra security, you can validate the token via API
    // Uncomment the following lines to use /api/verifyToken instead of direct verification
    /*
    try {
      const verifyResponse = await fetch(new URL('/api/verifyToken', request.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (!verifyResponse.ok) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
    */
  }

  // Step 7: Allow the request to proceed if not protected or authenticated
  return NextResponse.next();
}

// Configuration for the middleware matcher
// This ensures the middleware only runs on /admin routes and subpaths
export const config = {
  matcher: ['/admin/:path*'],
};
