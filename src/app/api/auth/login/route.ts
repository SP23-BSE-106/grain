import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { email, password } = await request.json();
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
      console.error('JWT secrets not configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    const isProduction = process.env.NODE_ENV === 'production';
    const response = NextResponse.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, accessToken });
    response.cookies.set('refreshToken', refreshToken, { httpOnly: true, secure: isProduction, sameSite: 'lax' });
    response.cookies.set('accessToken', accessToken, { secure: isProduction, sameSite: 'lax' });
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
