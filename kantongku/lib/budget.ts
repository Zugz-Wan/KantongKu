import { findBudgetByMonth } from "@/lib/db/budget-repository";
import { findTransactionsByUser } from "@/lib/db/transaction-repository";

export type BudgetStatusType = "SAFE" | "WARNING" | "DANGER" | "UNSET";

export interface BudgetStatusInfo {
  status: BudgetStatusType;
  label: string;
  badgeClass: string;
  progressBarClass: string;
  textClass: string;
  description: string;
}

export interface BudgetCalculationResult {
  hasBudget: boolean;
  budgetAmount: number;
  totalExpense: number;
  remainingAmount: number;
  usagePercentage: number; // Persentase penggunaan anggaran (%)
  month: number;
  year: number;
  statusInfo: BudgetStatusInfo;
}

/**
 * FR-BUD-07: Menentukan indikator status penggunaan anggaran berdasarkan persentase:
 * - < 75%  : Aman (SAFE)
 * - 75%-99%: Waspada (WARNING)
 * - >= 100%: Over Budget (DANGER)
 * - Belum diset: UNSET
 */
export function getBudgetStatus(usagePercentage: number, hasBudget: boolean): BudgetStatusInfo {
  if (!hasBudget) {
    return {
      status: "UNSET",
      label: "Belum Diatur",
      badgeClass: "border-slate-700 bg-slate-800 text-slate-300",
      progressBarClass: "bg-slate-700",
      textClass: "text-slate-400",
      description: "Anggaran bulanan belum ditentukan untuk periode ini.",
    };
  }

  if (usagePercentage >= 100) {
    return {
      status: "DANGER",
      label: "Over Budget",
      badgeClass: "border-rose-500/40 bg-rose-950/60 text-rose-400 shadow-rose-950/30",
      progressBarClass: "bg-gradient-to-r from-rose-600 to-rose-400",
      textClass: "text-rose-400",
      description: "Pengeluaran telah melebihi batas anggaran bulanan!",
    };
  }

  if (usagePercentage >= 75) {
    return {
      status: "WARNING",
      label: "Waspada",
      badgeClass: "border-amber-500/40 bg-amber-950/60 text-amber-400 shadow-amber-950/30",
      progressBarClass: "bg-gradient-to-r from-amber-600 to-amber-400",
      textClass: "text-amber-400",
      description: "Pengeluaran mendekati batas anggaran (>= 75%). Kendalikan pengeluaran.",
    };
  }

  return {
    status: "SAFE",
    label: "Aman",
    badgeClass: "border-emerald-500/40 bg-emerald-950/60 text-[#00df82] shadow-emerald-950/30",
    progressBarClass: "bg-gradient-to-r from-emerald-600 to-[#00df82]",
    textClass: "text-[#00df82]",
    description: "Pengeluaran masih dalam batas aman anggaran bulanan.",
  };
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

  // Format "YYYY-MM" (misal: "2026-09")
  const monthStr = `${year}-${String(month).padStart(2, "0")}`;

  // Rentang waktu bulan yang dihitung
  const startDate = new Date(year, month - 1, 1, 0, 0, 0);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  // 1. Ambil data anggaran bulanan untuk user pada bulan & tahun ini
  const budgetRecord = await findBudgetByMonth(userId, monthStr);

  const budgetAmount = budgetRecord?.amount || 0;
  const hasBudget = budgetAmount > 0;

  // 2. Ambil total seluruh transaksi pengeluaran (expense) pada bulan ini
  const allUserTransactions = await findTransactionsByUser(userId);
  const monthlyExpenses = allUserTransactions.filter((t) => {
    if (t.type !== "expense") return false;
    const txDate = new Date(t.date);
    return txDate >= startDate && txDate <= endDate;
  });

  const totalExpense = monthlyExpenses.reduce((sum, item) => sum + item.amount, 0);

  // 3. FR-BUD-06: Hitung persentase penggunaan anggaran
  const rawPercentage = hasBudget ? (totalExpense / budgetAmount) * 100 : 0;
  const usagePercentage = Math.round(rawPercentage * 10) / 10; // Dibulatkan 1 desimal

  // Sisa anggaran
  const remainingAmount = budgetAmount - totalExpense;

  // 4. FR-BUD-07: Tentukan status penggunaan anggaran
  const statusInfo = getBudgetStatus(usagePercentage, hasBudget);

  return {
    hasBudget,
    budgetAmount,
    totalExpense,
    remainingAmount,
    usagePercentage,
    month,
    year,
    statusInfo,
  };
}