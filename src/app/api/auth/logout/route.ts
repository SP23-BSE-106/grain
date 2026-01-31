import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.set('accessToken', '', { expires: new Date(0), path: '/' });
  response.cookies.set('refreshToken', '', { expires: new Date(0), path: '/' });
  return response;
}
