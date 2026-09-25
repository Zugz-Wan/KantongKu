"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

/**
 * F-05 Tambah Transaksi:
 * Menerima data jenis (income/expense), nominal, kategori, tanggal, keterangan,
 * dan menyimpannya ke tabel transactions milik pengguna yang sedang login.
 */
export async function createTransaction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Pengguna tidak terautentikasi.");
  }

  const type = formData.get("type") as string;
  const amountStr = formData.get("amount") as string;
  const category = (formData.get("category") as string)?.trim();
  const dateStr = formData.get("date") as string;
  const description = (formData.get("description") as string)?.trim() || null;

  if (!type || !["income", "expense"].includes(type)) {
    throw new Error("Jenis transaksi harus berupa pemasukan (income) atau pengeluaran (expense).");
  }

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    throw new Error("Nominal transaksi harus berupa angka lebih besar dari 0.");
  }

  if (!category) {
    throw new Error("Kategori transaksi wajib diisi.");
  }

  const date = dateStr ? new Date(dateStr) : new Date();

  await prisma.transaction.create({
    data: {
      userId: user.id,
      type,
      amount,
      category,
      date,
      description,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  redirect("/transactions");
}
