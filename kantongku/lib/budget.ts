import prisma from "@/lib/prisma";

export interface BudgetCalculationResult {
  hasBudget: boolean;
  budgetAmount: number;
  totalExpense: number;
  remainingAmount: number;
  usagePercentage: number; // Persentase penggunaan anggaran (%)
  month: number;
  year: number;
}

/**
 * FR-BUD-06: Menghitung persentase penggunaan anggaran berdasarkan
 * total pengeluaran terhadap anggaran bulanan pada bulan & tahun berjalan.
 * 
 * Rumus: (Total Pengeluaran Bulan Ini / Anggaran Bulanan) * 100%
 */
export async function calculateBudgetUsage(
  userId: string,
  targetMonth?: number,
  targetYear?: number
): Promise<BudgetCalculationResult> {
  const now = new Date();
  const month = targetMonth !== undefined ? targetMonth : now.getMonth() + 1; // 1 - 12
  const year = targetYear !== undefined ? targetYear : now.getFullYear();

  // Rentang waktu bulan yang dihitung
  const startDate = new Date(year, month - 1, 1, 0, 0, 0);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  // 1. Ambil data anggaran bulanan untuk user pada bulan & tahun ini
  const budgetRecord = await prisma.budget.findUnique({
    where: {
      userId_month_year: {
        userId,
        month,
        year,
      },
    },
  });

  const budgetAmount = budgetRecord?.amount || 0;
  const hasBudget = budgetAmount > 0;

  // 2. Ambil total seluruh transaksi pengeluaran (expense) pada bulan ini
  const monthlyExpenses = await prisma.transaction.findMany({
    where: {
      userId,
      type: "expense",
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      amount: true,
    },
  });

  const totalExpense = monthlyExpenses.reduce((sum, item) => sum + item.amount, 0);

  // 3. FR-BUD-06: Hitung persentase penggunaan anggaran
  // Rumus: (totalExpense / budgetAmount) * 100
  const rawPercentage = hasBudget ? (totalExpense / budgetAmount) * 100 : 0;
  const usagePercentage = Math.round(rawPercentage * 10) / 10; // Dibulatkan 1 desimal

  // Sisa anggaran
  const remainingAmount = budgetAmount - totalExpense;

  return {
    hasBudget,
    budgetAmount,
    totalExpense,
    remainingAmount,
    usagePercentage,
    month,
    year,
  };
}