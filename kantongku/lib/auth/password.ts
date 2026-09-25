import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash plain password menggunakan bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifikasi plain password terhadap hashed password
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
