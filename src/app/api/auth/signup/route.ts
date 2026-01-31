import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { name, email, password, role, secretCode } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Password Complexity Validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json({
        error: 'Password must be at least 8 chars and contain uppercase, lowercase, number, and special char'
      }, { status: 400 });
    }

    // Verify admin secret code
    if (role === 'admin') {
      const ADMIN_SECRET = process.env.ADMIN_SECRET_CODE || 'secret123'; // Default for dev
      if (secretCode !== ADMIN_SECRET) {
        return NextResponse.json({ error: 'Invalid admin secret code' }, { status: 403 });
      }
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
      console.error('JWT secrets not configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    const isProduction = process.env.NODE_ENV === 'production';
    const isVercel = request.nextUrl.host.includes('vercel.app');
    const response = NextResponse.json({ message: 'User created successfully' });
    const sameSiteValue = isProduction ? 'none' : 'lax';
    response.cookies.set('refreshToken', refreshToken, { httpOnly: true, secure: isProduction, sameSite: sameSiteValue as 'none' | 'lax', path: '/', ...(isVercel && { domain: `.${request.nextUrl.host}` }) });
    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
