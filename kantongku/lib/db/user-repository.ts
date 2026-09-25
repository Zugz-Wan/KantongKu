import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { User, UserSafe } from '@/lib/types/user';

/**
 * REPOSITORY USER
 * 
 * Saat ini menggunakan penyimpanan lokal (file / in-memory) karena Prisma & Database
 * belum di-setup.
 * 
 * CARA MENGGANTI KE PRISMA NANTINYA:
 * 1. Setup Prisma client di '@/lib/prisma'
 * 2. Ganti implementasi fungsi-fungsi di bawah ini dengan:
 *    - findUserByEmail: await prisma.user.findUnique({ where: { email } })
 *    - findUserById: await prisma.user.findUnique({ where: { id } })
 *    - createUser: await prisma.user.create({ data: { name, email, password } })
 */

const STORAGE_FILE = path.join(process.cwd(), '.mock_users.json');

// Helper untuk membaca daftar user
function readUsers(): User[] {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      return parsed.map((u: any) => ({
        ...u,
        createdAt: new Date(u.createdAt),
      }));
    }
  } catch (error) {
    console.error('Error reading mock users file:', error);
  }
  return [];
}

// Helper untuk menyimpan daftar user
function saveUsers(users: User[]): void {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving mock users file:', error);
  }
}

/**
 * Mencari user berdasarkan email (Case-insensitive)
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const found = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  return found || null;
}

/**
 * Mencari user berdasarkan ID
 */
export async function findUserById(id: string): Promise<User | null> {
  const users = readUsers();
  const found = users.find((u) => u.id === id);
  return found || null;
}

/**
 * Menyimpan user baru ke tabel Users
 */
export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<UserSafe> {
  const users = readUsers();
  const normalizedEmail = data.email.trim().toLowerCase();

  // Validasi unik email
  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error('Email sudah terdaftar. Gunakan email lain.');
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    name: data.name.trim(),
    email: normalizedEmail,
    password: data.passwordHash,
    createdAt: new Date(),
  };

  users.push(newUser);
  saveUsers(users);

  // Return safe user object (tanpa password)
  const { password: _, ...userSafe } = newUser;
  return userSafe;
}
