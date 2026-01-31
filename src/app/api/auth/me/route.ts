import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('accessToken')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    try {
      await connectToDatabase();
      const user = await User.findById(decoded.id).select('_id name email role');

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Fallback: return partial user data from token
      return NextResponse.json({
        user: {
          id: decoded.id,
          name: '',
          email: '',
          role: decoded.role,
        },
      });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
