import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getPrismaClient } from '@/lib/prisma';
import { findBudgetByMonth } from '@/lib/db/budget-repository';
import { MonthlyBudgetData } from '@/lib/types/budget';

export interface Transaction {
  id: string;
  userId: string;
  type: string; // "income" | "expense"
  amount: number;
  category: string;
  description: string | null;
  date: Date;
  createdAt: Date;
}

const STORAGE_FILE = path.join(process.cwd(), '.mock_transactions.json');

function readMockTransactions(): Transaction[] {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      return parsed.map((t: any) => ({
        ...t,
        amount: Number(t.amount),
        date: new Date(t.date),
        createdAt: new Date(t.createdAt),
      }));
    }
  } catch (error) {
    console.error('Error reading mock transactions file:', error);
  }
  return [];
}

function saveMockTransactions(transactions: Transaction[]): void {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(transactions, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving mock transactions file:', error);
  }
}

/**
 * Mengambil semua transaksi user
 */
export async function findTransactionsByUser(userId: string): Promise<Transaction[]> {
  const prisma = getPrismaClient();

  if (prisma) {
    try {
      const list = await (prisma as any).transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
      });
      if (list) return list;
    } catch (err) {
      console.warn('Prisma query transactions failed, falling back to local storage:', err);
    }
  }

  const list = readMockTransactions();
  return list
    .filter((t) => t.userId === userId)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

/**
 * Menyimpan transaksi baru (Prisma / Mock Fallback)
 */
export async function createTransactionRecord(data: {
  userId: string;
  type: string;
  amount: number;
  category: string;
  description?: string | null;
  date?: Date;
}): Promise<Transaction> {
  const prisma = getPrismaClient();

  if (prisma) {
    try {
      const created = await (prisma as any).transaction.create({
        data: {
          userId: data.userId,
          type: data.type,
          amount: data.amount,
          category: data.category,
          description: data.description || null,
          date: data.date || new Date(),
        },
      });
      return created;
    } catch (err) {
      console.warn('Prisma create transaction failed, falling back to local storage:', err);
    }
  }

  const transactions = readMockTransactions();
  const newTx: Transaction = {
    id: crypto.randomUUID(),
    userId: data.userId,
    type: data.type,
    amount: data.amount,
    category: data.category,
    description: data.description || null,
    date: data.date || new Date(),
    createdAt: new Date(),
  };

  transactions.unshift(newTx);
  saveMockTransactions(transactions);
  return newTx;
}

/**
 * FR-BUD-03: Menghitung metrik lengkap budget bulanan berdasarkan bulan ("YYYY-MM")
 */
export async function getMonthlyBudgetData(
  userId: string,
  month: string // "YYYY-MM" (contoh: "2026-09")
): Promise<MonthlyBudgetData> {
  const [yearStr, monthStr] = month.split('-');
  const year = parseInt(yearStr, 10);
  const monthNum = parseInt(monthStr, 10); // 1-indexed (1-12)

  // Rentang tanggal awal dan akhir bulan
  const startDate = new Date(year, monthNum - 1, 1, 0, 0, 0, 0);
  const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);
  const totalDaysInMonth = new Date(year, monthNum, 0).getDate();

  // Menghitung sisa hari dalam bulan ini
  const today = new Date();
  let daysRemainingInMonth = 1;
  if (
    today.getFullYear() === year &&
    today.getMonth() === monthNum - 1
  ) {
    daysRemainingInMonth = Math.max(1, totalDaysInMonth - today.getDate() + 1);
  } else if (today < startDate) {
    daysRemainingInMonth = totalDaysInMonth;
  } else {
    daysRemainingInMonth = 0;
  }

  // Mengambil data budget untuk bulan ini
  const budget = await findBudgetByMonth(userId, month);
  const budgetAmount = budget ? budget.amount : 0;

  // Mengambil transaksi pengeluaran pada rentang bulan ini
  const allUserTransactions = await findTransactionsByUser(userId);
  const monthlyExpenses = allUserTransactions.filter((t) => {
    if (t.type !== 'expense') return false;
    const txDate = new Date(t.date);
    return txDate >= startDate && txDate <= endDate;
  });

  const totalExpense = monthlyExpenses.reduce((sum, t) => sum + t.amount, 0);
  const remainingBudget = budgetAmount - totalExpense;
  const percentageUsed = budgetAmount > 0 ? (totalExpense / budgetAmount) * 100 : 0;
  const isOverBudget = budgetAmount > 0 && totalExpense > budgetAmount;

  // Rekomendasi pengeluaran harian
  let dailySpendingRecommendation = 0;
  if (daysRemainingInMonth > 0 && remainingBudget > 0) {
    dailySpendingRecommendation = Math.floor(remainingBudget / daysRemainingInMonth);
  }

  // Distribusi pengeluaran per kategori
  const categoryMap = new Map<string, number>();
  for (const t of monthlyExpenses) {
    const current = categoryMap.get(t.category) || 0;
    categoryMap.set(t.category, current + t.amount);
  }

  const categoryExpenses = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentageOfTotalExpense: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    month,
    budget,
    budgetAmount,
    totalExpense,
    remainingBudget,
    percentageUsed,
    isOverBudget,
    dailySpendingRecommendation,
    daysRemainingInMonth,
    totalDaysInMonth,
    categoryExpenses,
  };
}
