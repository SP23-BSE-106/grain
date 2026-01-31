import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '1h' });
}

export function verifyToken(token: string): any {
  console.log('🔑 AUTH_LIB: verifyToken called with token:', !!token);
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    console.log('🔑 AUTH_LIB: Token verified successfully:', !!decoded);
    if (decoded) {
      console.log('🔑 AUTH_LIB: Decoded payload:', decoded);
    }
    return decoded;
  } catch (error) {
    console.log('🔑 AUTH_LIB: Token verification failed:', error);
    return null;
  }
}
