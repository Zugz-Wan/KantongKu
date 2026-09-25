import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { User, UserSafe } from '@/lib/types/user';
import { getPrismaClient } from '@/lib/prisma';

/**
 * REPOSITORY USER (Prisma Ready)
 * 
 * Jika DATABASE_URL terkonfigurasi di .env, modul ini akan menggunakan Prisma Client.
 * Jika belum ada database aktif, modul secara otomatis menggunakan storage lokal.
 */

const STORAGE_FILE = path.join(process.cwd(), '.mock_users.json');

// Fallback Helper: Membaca daftar user dari file mock
function readMockUsers(): User[] {
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

// Fallback Helper: Menyimpan daftar user ke file mock
function saveMockUsers(users: User[]): void {
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
  const normalizedEmail = email.trim().toLowerCase();
  const prisma = getPrismaClient();

  if (prisma) {
    try {
      const dbUser = await (prisma as any).user.findUnique({
        where: { email: normalizedEmail },
      });
      if (dbUser) return dbUser;
    } catch (err) {
      console.warn('Prisma query failed, falling back to local storage:', err);
    }
  }

  const users = readMockUsers();
  return users.find((u) => u.email.toLowerCase() === normalizedEmail) || null;
}

/**
 * Mencari user berdasarkan ID
 */
export async function findUserById(id: string): Promise<User | null> {
  const prisma = getPrismaClient();

  if (prisma) {
    try {
      const dbUser = await (prisma as any).user.findUnique({
        where: { id },
      });
      if (dbUser) return dbUser;
    } catch (err) {
      console.warn('Prisma query failed, falling back to local storage:', err);
    }
  }

  const users = readMockUsers();
  return users.find((u) => u.id === id) || null;
}

/**
 * Menyimpan user baru ke tabel Users (Prisma / Local Fallback)
 */
export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<UserSafe> {
  const normalizedEmail = data.email.trim().toLowerCase();

  // Validasi unik email
  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    throw new Error('Email sudah terdaftar. Gunakan email lain.');
  }

  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const created = await (prisma as any).user.create({
        data: {
          name: data.name.trim(),
          email: normalizedEmail,
          password: data.passwordHash,
        },
      });
      const { password: _, ...userSafe } = created;
      return userSafe;
    } catch (err: any) {
      console.warn('Prisma create failed, falling back to local storage:', err);
    }
  }

  // Fallback storage
  const users = readMockUsers();
  const newUser: User = {
    id: crypto.randomUUID(),
    name: data.name.trim(),
    email: normalizedEmail,
    password: data.passwordHash,
    createdAt: new Date(),
  };

  users.push(newUser);
  saveMockUsers(users);

  const { password: _, ...userSafe } = newUser;
  return userSafe;
}
