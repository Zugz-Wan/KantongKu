import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.trim().length === 0) {
    return null;
  }
  try {
    const adapter = new PrismaPg({ connectionString });
    return new PrismaClient({ adapter });
  } catch (err) {
    console.warn("Gagal menginisialisasi PrismaClient:", err);
    return null;
  }
};

declare const globalThis: {
  prismaGlobal: PrismaClient | null | undefined;
} & typeof global;

const prisma = globalThis.prismaGlobal !== undefined ? globalThis.prismaGlobal : prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

/**
 * Ekspor named helper untuk kompatibilitas dengan user-repository.ts (Programmer 1)
 */
export function getPrismaClient(): PrismaClient | null {
  return prisma;
}

/**
 * Ekspor default untuk kompatibilitas dengan modul Programmer 2 & transaksi
 */
export default prisma as PrismaClient;