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
  console.log('verifyToken called with token:', token ? 'present' : 'null');
  console.log('JWT_ACCESS_SECRET set:', !!process.env.JWT_ACCESS_SECRET);
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET);
  } catch (error) {
    console.log('JWT verify error:', (error as Error).message);
    return null;
  }
}
