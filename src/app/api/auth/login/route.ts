import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  console.log('🔑 LOGIN_API: Login attempt started');

  try {
    await connectToDatabase();
    const { email, password, role } = await request.json();
    console.log('🔑 LOGIN_API: Login attempt for email:', email, 'role:', role);

    const user = await User.findOne({ email });
    console.log('🔑 LOGIN_API: User found:', !!user);

    if (!user || !await bcrypt.compare(password, user.password)) {
      console.log('🔑 LOGIN_API: Invalid credentials');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.role !== role) {
      console.log('🔑 LOGIN_API: Role mismatch - user role:', user.role, 'requested role:', role);
      return NextResponse.json({ error: 'Role mismatch' }, { status: 403 });
    }

    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
      console.error('🔑 LOGIN_API: JWT secrets not configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    console.log('🔑 LOGIN_API: Tokens generated successfully');

    const isProduction = process.env.NODE_ENV === 'production';
    const isVercel = request.nextUrl.host.includes('vercel.app');
    const response = NextResponse.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, accessToken });

    const sameSiteValue = isProduction ? 'none' : 'lax';
    const refreshCookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: sameSiteValue as 'none' | 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    };
    const accessCookieOptions = {
      httpOnly: false,
      secure: isProduction,
      sameSite: sameSiteValue as 'none' | 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    };

    response.cookies.set('refreshToken', refreshToken, refreshCookieOptions);
    response.cookies.set('accessToken', accessToken, accessCookieOptions);

    console.log('🔑 LOGIN_API: Cookies set in response - accessToken httpOnly:', accessCookieOptions.httpOnly);

    return response;
  } catch (error) {
    console.error('🔑 LOGIN_API: Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
