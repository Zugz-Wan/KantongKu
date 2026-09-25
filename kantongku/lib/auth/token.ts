import { SignJWT, jwtVerify } from 'jose';
import { SessionPayload } from '@/lib/types/user';

export const SESSION_COOKIE_NAME = 'kantongku_session';
export const SESSION_EXPIRATION_TIME = '7d';
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET || 'kantongku-super-secret-jwt-key-for-session-management-2026-secure';
  return new TextEncoder().encode(secret);
}

/**
 * Membuat token session JWT bertanda tangan (HS256)
 */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const secretKey = getSecretKey();
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRATION_TIME)
    .sign(secretKey);
}

/**
 * Memverifikasi token session JWT
 * 100% kompatibel dengan Next.js Edge Runtime (middleware) & Node.js
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}
