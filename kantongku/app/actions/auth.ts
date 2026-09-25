'use server';

import { redirect } from 'next/navigation';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { findUserByEmail, createUser } from '@/lib/db/user-repository';
import { createSessionToken, setSessionCookie, deleteSessionCookie } from '@/lib/session';
import { AuthState } from '@/lib/types/user';

/**
 * F-01 REGISTER SERVER ACTION
 */
export async function registerAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  const fieldErrors: AuthState['fieldErrors'] = {};

  // 1. Validasi input nama
  if (!name || name.trim().length < 2) {
    fieldErrors.name = ['Nama minimal terdiri dari 2 karakter.'];
  }

  // 2. Validasi input email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    fieldErrors.email = ['Format email tidak valid.'];
  }

  // 3. Validasi input password
  if (!password || password.length < 6) {
    fieldErrors.password = ['Password minimal terdiri dari 6 karakter.'];
  }

  // 4. Validasi konfirmasi password
  if (password !== confirmPassword) {
    fieldErrors.confirmPassword = ['Konfirmasi password tidak cocok.'];
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  try {
    // 5. Validasi email unik
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return {
        error: 'Email sudah terdaftar. Silakan gunakan email lain atau login.',
        fieldErrors: {
          email: ['Email sudah terdaftar.'],
        },
      };
    }

    // 6. Hashing password
    const hashedPassword = await hashPassword(password);

    // 7. Simpan ke tabel Users (Mock Repository)
    const newUser = await createUser({
      name,
      email,
      passwordHash: hashedPassword,
    });

    // 8. Buat session dan pasang cookie
    const token = await createSessionToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });
    await setSessionCookie(token);
  } catch (err: any) {
    console.error('Registration error:', err);
    return {
      error: err.message || 'Terjadi kesalahan saat registrasi. Silakan coba lagi.',
    };
  }

  // 9. Redirect ke dashboard setelah registrasi berhasil
  redirect('/dashboard');
}

/**
 * F-02 LOGIN SERVER ACTION
 */
export async function loginAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const targetRedirect = (formData.get('redirect') as string) || '/dashboard';

  const fieldErrors: AuthState['fieldErrors'] = {};

  if (!email) {
    fieldErrors.email = ['Email wajib diisi.'];
  }

  if (!password) {
    fieldErrors.password = ['Password wajib diisi.'];
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  try {
    // 1. Cari user berdasarkan email
    const user = await findUserByEmail(email);
    if (!user) {
      return {
        error: 'Email atau password salah. Silakan periksa kembali kredensial Anda.',
      };
    }

    // 2. Verifikasi hash password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return {
        error: 'Email atau password salah. Silakan periksa kembali kredensial Anda.',
      };
    }

    // 3. Buat session JWT dan set httpOnly cookie
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
    await setSessionCookie(token);
  } catch (err: any) {
    console.error('Login error:', err);
    return {
      error: err.message || 'Terjadi kesalahan saat login. Silakan coba lagi.',
    };
  }

  // 4. Redirect ke dashboard atau route sebelumnya
  const safeRedirect = targetRedirect.startsWith('/') ? targetRedirect : '/dashboard';
  redirect(safeRedirect);
}

/**
 * F-12 LOGOUT SERVER ACTION
 */
export async function logoutAction(): Promise<void> {
  await deleteSessionCookie();
  redirect('/login');
}
