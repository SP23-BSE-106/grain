import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === 'production';
  const domain = isProduction ? request.nextUrl.host : undefined;
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.set('accessToken', '', { expires: new Date(0), path: '/', domain });
  response.cookies.set('refreshToken', '', { expires: new Date(0), path: '/', domain });
  return response;
}
