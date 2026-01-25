import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';

// TypeScript interface for the request body
interface VerifyTokenRequest {
  token: string;
}

// TypeScript interface for the response
interface VerifyTokenResponse {
  valid: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Step 1: Parse the request body to get the token
    const { token }: VerifyTokenRequest = await request.json();

    // Step 2: Check if token is provided
    if (!token) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    // Step 3: Verify the token using the verifyToken function
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }
    console.log('VerifyToken: Decoded id:', decoded.id, 'role:', decoded.role);

    // Step 4: Connect to database and fetch user details
    await connectToDatabase();
    const user = await User.findById(decoded.id).select('name email role');
    if (!user) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    // Step 5: Return success response with user data
    const response: VerifyTokenResponse = {
      valid: true,
      user: {
        id: decoded.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
