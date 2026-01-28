import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.set('accessToken', '', { expires: new Date(0), path: '/' });
  response.cookies.set('refreshToken', '', { expires: new Date(0), path: '/' });
  return response;
}
