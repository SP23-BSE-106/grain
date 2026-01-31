import { jwtVerify } from 'jose';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const encodedSecret = new TextEncoder().encode(JWT_ACCESS_SECRET);

export async function verifyToken(token: string): Promise<any> {
    console.log('🔑 TOKEN_LIB: verifyToken called with token:', !!token);
    try {
        const { payload } = await jwtVerify(token, encodedSecret);
        console.log('🔑 TOKEN_LIB: Token verified successfully:', !!payload);
        if (payload) {
            console.log('🔑 TOKEN_LIB: Decoded payload:', payload);
        }
        return payload;
    } catch (error) {
        console.log('🔑 TOKEN_LIB: Token verification failed:', error);
        return null;
    }
}
