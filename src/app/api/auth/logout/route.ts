import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === 'production';
  const isVercel = request.nextUrl.host.includes('vercel.app');
  const cookieOptions = {
    expires: new Date(0),
    path: '/',
  };
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.set('accessToken', '', cookieOptions);
  response.cookies.set('refreshToken', '', cookieOptions);
  return response;
}
