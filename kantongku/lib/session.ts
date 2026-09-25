import { cookies } from 'next/headers';
import { SessionPayload, UserSafe } from '@/lib/types/user';
import { findUserById } from '@/lib/db/user-repository';
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  verifySessionToken,
} from '@/lib/auth/token';

export { SESSION_COOKIE_NAME, createSessionToken, verifySessionToken };

/**
 * Menyimpan session token ke HTTP-Only Cookie
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * Menghapus session cookie (Logout)
 */
export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * HELPER UNTUK PROGRAMMER 2 & 3:
 * Mengambil data sesi pengguna saat ini dari cookie.
 * Mengembalikan SessionPayload ({ userId, email, name }) jika valid, atau null jika belum login.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  return await verifySessionToken(token);
}

/**
 * HELPER UNTUK PROGRAMMER 2 & 3:
 * Mengambil User ID pengguna saat ini.
 * Mengembalikan string id jika login, atau null jika belum login.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.userId || null;
}

/**
 * HELPER TAMBAHAN:
 * Mengambil seluruh profil User pengguna saat ini (tanpa hash password).
 */
export async function getCurrentUser(): Promise<UserSafe | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const user = await findUserById(userId);
  if (!user) return null;

  const { password: _, ...userSafe } = user;
  return userSafe;
}
