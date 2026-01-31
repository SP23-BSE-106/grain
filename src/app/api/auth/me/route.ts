import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  console.log('🔑 AUTH_ME_API: /api/auth/me called');

  try {
    const token = request.cookies.get('accessToken')?.value;
    console.log('🔑 AUTH_ME_API: Token from cookies:', !!token);

    if (!token) {
      console.log('🔑 AUTH_ME_API: No token provided, returning 401');
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    console.log('🔑 AUTH_ME_API: Token verification result:', !!decoded);
    if (decoded) {
      console.log('🔑 AUTH_ME_API: Decoded token:', { id: decoded.id, role: decoded.role });
    }

    if (!decoded) {
      console.log('🔑 AUTH_ME_API: Invalid token, returning 401');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    try {
      console.log('🔑 AUTH_ME_API: Connecting to database...');
      await connectToDatabase();
      console.log('🔑 AUTH_ME_API: Finding user by ID:', decoded.id);
      const user = await User.findById(decoded.id).select('_id name email role');
      console.log('🔑 AUTH_ME_API: User found:', !!user);

      if (!user) {
        console.log('🔑 AUTH_ME_API: User not found, returning 404');
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const userData = {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
      console.log('🔑 AUTH_ME_API: Returning user data:', userData);
      return NextResponse.json(userData);
    } catch (dbError) {
      console.error('🔑 AUTH_ME_API: Database error:', dbError);
      // Fallback: return partial user data from token
      const fallbackData = {
        user: {
          id: decoded.id,
          name: '',
          email: '',
          role: decoded.role,
        },
      };
      console.log('🔑 AUTH_ME_API: Returning fallback user data:', fallbackData);
      return NextResponse.json(fallbackData);
    }
  } catch (error) {
    console.error('🔑 AUTH_ME_API: Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
