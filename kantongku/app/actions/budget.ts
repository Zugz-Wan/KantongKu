"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";

/**
 * FR-BUD-08: Otorisasi & Akses Data Anggaran
 * Sistem memastikan pengguna HANYA dapat mengakses, melihat,
 * dan mengubah data budget miliknya sendiri.
 * 
 * Pengambilan userId murni berasal dari session token server (HTTP-Only Cookie),
 * bukan dari parameter input form client, untuk mencegah impersonasi atau modifikasi data orang lain.
 */
export async function setBudgetAction(formData: FormData) {
  // 1. Validasi Otorisasi Pengguna (FR-BUD-08)
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) {
    throw new Error("Tidak memiliki otorisasi: Sesi pengguna tidak valid.");
  }

  const amountStr = formData.get("amount") as string;
  const monthStr = formData.get("month") as string;
  const yearStr = formData.get("year") as string;

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    throw new Error("Nominal anggaran harus berupa angka lebih besar dari 0.");
  }

  const now = new Date();
  const month = monthStr ? parseInt(monthStr, 10) : now.getMonth() + 1;
  const year = yearStr ? parseInt(yearStr, 10) : now.getFullYear();

  if (month < 1 || month > 12) {
    throw new Error("Bulan tidak valid (harus 1 - 12).");
  }

  // 2. Operasi Database dengan filter tegas pada currentUserId (FR-BUD-08)
  await prisma.budget.upsert({
    where: {
      userId_month_year: {
        userId: currentUserId,
        month,
        year,
      },
    },
    update: {
      amount,
    },
    create: {
      userId: currentUserId,
      amount,
      month,
      year,
    },
  });

  revalidatePath("/dashboard");
}

/**
 * Mengambil data budget milik user yang sedang terautentikasi (FR-BUD-08)
 */
export async function getMyBudget(month: number, year: number) {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) return null;

  return await prisma.budget.findUnique({
    where: {
      userId_month_year: {
        userId: currentUserId,
        month,
        year,
      },
    },
  });
}