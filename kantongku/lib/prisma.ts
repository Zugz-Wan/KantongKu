import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Mengembalikan instance PrismaClient jika DATABASE_URL terkonfigurasi.
 * Mengembalikan null jika belum ada koneksi database.
 */
export function getPrismaClient(): PrismaClient | null {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim().length === 0) {
    return null;
  }

  try {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient();
    }
    return globalForPrisma.prisma;
  } catch (err) {
    console.warn('Gagal menginisialisasi PrismaClient:', err);
    return null;
  }
}
