import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getMonthlyBudgetData } from "@/lib/db/transaction-repository";
import { findBudgetsByUser } from "@/lib/db/budget-repository";
import { BudgetClientContainer } from "@/components/BudgetClientContainer";

export const dynamic = "force-dynamic";

interface BudgetPageProps {
  searchParams: Promise<{ month?: string; status?: string }>;
}

export default async function BudgetPage({ searchParams }: BudgetPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;

  // Tentukan bulan default jika parameter URL tidak diberikan (Format "YYYY-MM")
  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const selectedMonth = resolvedSearchParams.month || defaultMonth;

  // Mengambil kalkulasi metrik budget bulanan dan riwayat budget seluruh bulan
  const monthlyData = await getMonthlyBudgetData(user.id, selectedMonth);
  const allBudgets = await findBudgetsByUser(user.id);

  return (
    <div className="relative">
      {/* Subtle background ambient glow */}
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-[260px] w-[500px] rounded-full bg-emerald-500/10 blur-[130px]" />

      <BudgetClientContainer
        monthlyData={monthlyData}
        allBudgets={allBudgets}
        currentMonth={selectedMonth}
        statusNotification={resolvedSearchParams.status || null}
      />
    </div>
  );
}
