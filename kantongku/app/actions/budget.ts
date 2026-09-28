"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { upsertBudget, deleteBudget } from "@/lib/db/budget-repository";

/**
 * FR-BUD-01 (Membuat Anggaran) & FR-BUD-02 (Mengubah Nominal Anggaran):
 * Menyimpan atau memperbarui nominal anggaran bulanan untuk pengguna yang sedang login.
 */
export async function saveBudget(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Pengguna tidak terautentikasi.");
  }

  const month = (formData.get("month") as string)?.trim();
  const amountStr = formData.get("amount") as string;
  const notes = (formData.get("notes") as string)?.trim() || null;

  if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    throw new Error("Format bulan tidak valid. Gunakan format YYYY-MM (contoh: 2026-09).");
  }

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    throw new Error("Nominal anggaran harus berupa angka lebih besar dari 0.");
  }

  await upsertBudget(user.id, {
    month,
    amount,
    notes,
  });

  revalidatePath("/budget");
  revalidatePath("/dashboard");
  redirect(`/budget?month=${month}&status=saved`);
}

/**
 * Menghapus data budget untuk bulan tertentu
 */
export async function deleteBudgetAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Pengguna tidak terautentikasi.");
  }

  const month = (formData.get("month") as string)?.trim();
  if (!month) {
    throw new Error("Parameter bulan diperlukan.");
  }

  await deleteBudget(user.id, month);

  revalidatePath("/budget");
  revalidatePath("/dashboard");
  redirect(`/budget?month=${month}&status=deleted`);
}
