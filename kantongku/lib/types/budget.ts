export interface Budget {
  id: string;
  userId: string;
  month: string; // Format "YYYY-MM", contoh "2026-09"
  amount: number;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MonthlyBudgetData {
  month: string; // "YYYY-MM"
  budget: Budget | null;
  budgetAmount: number;
  totalExpense: number;
  remainingBudget: number;
  percentageUsed: number;
  isOverBudget: boolean;
  dailySpendingRecommendation: number;
  daysRemainingInMonth: number;
  totalDaysInMonth: number;
  categoryExpenses: {
    category: string;
    amount: number;
    percentageOfTotalExpense: number;
  }[];
}
