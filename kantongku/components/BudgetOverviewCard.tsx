import { MonthlyBudgetData } from "@/lib/types/budget";

interface BudgetOverviewCardProps {
  data: MonthlyBudgetData;
  onOpenEditModal?: () => void;
}

export function BudgetOverviewCard({
  data,
  onOpenEditModal,
}: BudgetOverviewCardProps) {
  const {
    month,
    budget,
    budgetAmount,
    totalExpense,
    remainingBudget,
    percentageUsed,
    isOverBudget,
    dailySpendingRecommendation,
    daysRemainingInMonth,
  } = data;

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const hasBudget = budgetAmount > 0;

  // Warna indikator status progress
  let progressColor = "bg-[#00df82]";
  let statusBadge = {
    text: "Terkendali & Aman",
    bg: "bg-emerald-950/80 text-[#00df82] border-emerald-500/30",
  };

  if (percentageUsed >= 100) {
    progressColor = "bg-rose-500";
    statusBadge = {
      text: "Melebihi Anggaran (Overbudget)",
      bg: "bg-rose-950/80 text-rose-400 border-rose-500/30",
    };
  } else if (percentageUsed >= 80) {
    progressColor = "bg-amber-400";
    statusBadge = {
      text: "Mendekati Batas (Waspada)",
      bg: "bg-amber-950/80 text-amber-300 border-amber-500/30",
    };
  }

  // Cap visual bar width to 100%
  const clampedPercentage = Math.min(percentageUsed, 100);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#070e20]/90 p-6 sm:p-8 shadow-xl shadow-emerald-950/10">
      {/* Glow decorative background */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00df82]">
              Ringkasan Anggaran Bulanan
            </span>
            {hasBudget && (
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusBadge.bg}`}
              >
                {statusBadge.text}
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {hasBudget ? formatRupiah(budgetAmount) : "Belum Ditentukan"}
          </h2>
          {budget?.notes && (
            <p className="mt-1 text-xs text-slate-400 italic">
              &ldquo;{budget.notes}&rdquo;
            </p>
          )}
        </div>

        {/* Tombol Ubah / Tetapkan Anggaran (FR-BUD-01 & FR-BUD-02) */}
        {onOpenEditModal && (
          <button
            type="button"
            onClick={onOpenEditModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00df82] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-slate-950 shadow-md shadow-[#00df82]/20 hover:bg-[#05f196] hover:scale-105 active:scale-98 transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>{hasBudget ? "Ubah Nominal Anggaran" : "+ Tetapkan Anggaran"}</span>
          </button>
        )}
      </div>

      {/* Visual Progress Bar (Jika ada budget) */}
      {hasBudget ? (
        <div className="py-6 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-400">
              Terpakai:{" "}
              <strong className="text-white">{percentageUsed.toFixed(1)}%</strong>
            </span>
            <span className={isOverBudget ? "text-rose-400" : "text-[#00df82]"}>
              {isOverBudget ? "Overbudget" : "Tersisa"}:{" "}
              <strong>{formatRupiah(Math.abs(remainingBudget))}</strong>
            </span>
          </div>

          {/* Progress track */}
          <div className="relative h-3.5 w-full overflow-hidden rounded-full bg-slate-900 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${progressColor}`}
              style={{ width: `${clampedPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Rp 0</span>
            <span>Pagu: {formatRupiah(budgetAmount)}</span>
          </div>
        </div>
      ) : (
        <div className="py-6 text-center">
          <p className="text-xs text-slate-400">
            Anda belum menentukan target batas anggaran pengeluaran untuk bulan ini.
          </p>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
        {/* Total Pengeluaran Bulan Ini */}
        <div className="rounded-2xl border border-slate-800/90 bg-[#091224]/80 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
              Total Pengeluaran
            </span>
            <span className="text-xs">💸</span>
          </div>
          <p className="mt-2 text-xl font-black text-rose-400 tabular-nums">
            {formatRupiah(totalExpense)}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Akumulasi bulan terpilih
          </p>
        </div>

        {/* Sisa Anggaran */}
        <div className="rounded-2xl border border-slate-800/90 bg-[#091224]/80 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Sisa Saldo Anggaran
            </span>
            <span className="text-xs">🛡️</span>
          </div>
          <p
            className={`mt-2 text-xl font-black tabular-nums ${
              isOverBudget ? "text-rose-400" : "text-[#00df82]"
            }`}
          >
            {hasBudget ? formatRupiah(remainingBudget) : "-"}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {isOverBudget
              ? "Defisit dari anggaran"
              : hasBudget
              ? "Uang aman tersisa"
              : "Belum diset"}
          </p>
        </div>

        {/* Rekomendasi Pengeluaran Harian */}
        <div className="rounded-2xl border border-slate-800/90 bg-[#091224]/80 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
              Batas Aman Harian
            </span>
            <span className="text-xs">📅</span>
          </div>
          <p className="mt-2 text-xl font-black text-sky-400 tabular-nums">
            {hasBudget && remainingBudget > 0 && daysRemainingInMonth > 0
              ? `${formatRupiah(dailySpendingRecommendation)}/hr`
              : "-"}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {daysRemainingInMonth > 0
              ? `Untuk sisa ${daysRemainingInMonth} hari bulan ini`
              : "Bulan telah berakhir"}
          </p>
        </div>
      </div>
    </div>
  );
}
