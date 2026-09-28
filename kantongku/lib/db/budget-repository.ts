import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Budget } from '@/lib/types/budget';
import { getPrismaClient } from '@/lib/prisma';

/**
 * REPOSITORY BUDGET (Prisma Ready dengan Local Fallback)
 *
 * Mendukung FR-BUD-01, FR-BUD-02, dan FR-BUD-03
 */

const STORAGE_FILE = path.join(process.cwd(), '.mock_budgets.json');

// Helper Fallback: Membaca data budget dari mock file
function readMockBudgets(): Budget[] {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      return parsed.map((b: any) => ({
        ...b,
        amount: Number(b.amount),
        createdAt: new Date(b.createdAt),
        updatedAt: new Date(b.updatedAt),
      }));
    }
  } catch (error) {
    console.error('Error reading mock budgets file:', error);
  }
  return [];
}

// Helper Fallback: Menyimpan data budget ke mock file
function saveMockBudgets(budgets: Budget[]): void {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(budgets, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving mock budgets file:', error);
  }
}

/**
 * FR-BUD-03: Mengambil budget user untuk bulan tertentu ("YYYY-MM")
 */
export async function findBudgetByMonth(
  userId: string,
  month: string
): Promise<Budget | null> {
  const prisma = getPrismaClient();

  if (prisma) {
    try {
      const dbBudget = await (prisma as any).budget.findUnique({
        where: {
          userId_month: {
            userId,
            month,
          },
        },
      });
      if (dbBudget) return dbBudget;
    } catch (err) {
      console.warn('Prisma query budget failed, falling back to local storage:', err);
    }
  }

  const budgets = readMockBudgets();
  return budgets.find((b) => b.userId === userId && b.month === month) || null;
}

/**
 * Mengambil seluruh riwayat budget user
 */
export async function findBudgetsByUser(userId: string): Promise<Budget[]> {
  const prisma = getPrismaClient();

  if (prisma) {
    try {
      const dbBudgets = await (prisma as any).budget.findMany({
        where: { userId },
        orderBy: { month: 'desc' },
      });
      if (dbBudgets && dbBudgets.length > 0) return dbBudgets;
    } catch (err) {
      console.warn('Prisma query all budgets failed, falling back to local storage:', err);
    }
  }

  const budgets = readMockBudgets();
  return budgets
    .filter((b) => b.userId === userId)
    .sort((a, b) => b.month.localeCompare(a.month));
}

/**
 * FR-BUD-01 & FR-BUD-02: Membuat atau Memperbarui Budget Bulanan (Upsert)
 */
export async function upsertBudget(
  userId: string,
  data: {
    month: string;
    amount: number;
    notes?: string | null;
  }
): Promise<Budget> {
  const prisma = getPrismaClient();

  if (prisma) {
    try {
      const saved = await (prisma as any).budget.upsert({
        where: {
          userId_month: {
            userId,
            month: data.month,
          },
        },
        create: {
          userId,
          month: data.month,
          amount: data.amount,
          notes: data.notes || null,
        },
        update: {
          amount: data.amount,
          notes: data.notes !== undefined ? data.notes : undefined,
        },
      });
      return saved;
    } catch (err) {
      console.warn('Prisma upsert budget failed, falling back to local storage:', err);
    }
  }

  // Fallback Local Storage
  const budgets = readMockBudgets();
  const index = budgets.findIndex((b) => b.userId === userId && b.month === data.month);

  const now = new Date();
  if (index >= 0) {
    // FR-BUD-02: Update existing budget
    budgets[index] = {
      ...budgets[index],
      amount: data.amount,
      notes: data.notes !== undefined ? data.notes : budgets[index].notes,
      updatedAt: now,
    };
    saveMockBudgets(budgets);
    return budgets[index];
  } else {
    // FR-BUD-01: Create new budget
    const newBudget: Budget = {
      id: crypto.randomUUID(),
      userId,
      month: data.month,
      amount: data.amount,
      notes: data.notes || null,
      createdAt: now,
      updatedAt: now,
    };
    budgets.push(newBudget);
    saveMockBudgets(budgets);
    return newBudget;
  }
}

/**
 * Menghapus budget untuk bulan tertentu
 */
export async function deleteBudget(userId: string, month: string): Promise<boolean> {
  const prisma = getPrismaClient();

  if (prisma) {
    try {
      await (prisma as any).budget.delete({
        where: {
          userId_month: {
            userId,
            month,
          },
        },
      });
      return true;
    } catch (err) {
      console.warn('Prisma delete budget failed, falling back to local storage:', err);
    }
  }

  const budgets = readMockBudgets();
  const filtered = budgets.filter((b) => !(b.userId === userId && b.month === month));
  saveMockBudgets(filtered);
  return true;
}
