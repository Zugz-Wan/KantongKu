"use client";

import { useState } from "react";
import { BudgetCalculationResult } from "@/lib/budget";
import { setBudgetAction } from "@/app/actions/budget";

interface BudgetIndicatorProps {
  budgetData: BudgetCalculationResult;
}

export function BudgetIndicator({ budgetData }: BudgetIndicatorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const {
    hasBudget,
    budgetAmount,
    totalExpense,
    remainingAmount,
    usagePercentage,
    statusInfo,
    month,
    year,
  } = budgetData;

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const currentMonthName = monthNames[month - 1];

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const progressWidth = Math.min(Math.max(usagePercentage, 0), 100);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    try {
      await setBudgetAction(formData);
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan anggaran.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#070e20]/80 p-6 backdrop-blur-md shadow-xl shadow-emerald-950/10">
      {/* Header: Judul, Status & Tombol Atur Anggaran (FR-BUD-07 & FR-BUD-08) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-950/80 border border-emerald-500/20 text-xs">
              🎯
            </span>
            <h3 className="text-sm font-bold text-white">
              Anggaran Bulanan ({currentMonthName} {year})
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {statusInfo.description}
          </p>
        </div>

        {/* FR-BUD-07 Status & FR-BUD-08 Atur Anggaran Pribadi */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold shadow-xs ${statusInfo.badgeClass}`}
          >
            {statusInfo.status === "SAFE" && <span>✓</span>}
            {statusInfo.status === "WARNING" && <span>⚠</span>}
            {statusInfo.status === "DANGER" && <span>🚨</span>}
            {statusInfo.status === "UNSET" && <span>⚪</span>}
            <span>Status: {statusInfo.label}</span>
          </span>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs font-semibold text-slate-200 hover:border-[#00df82] hover:text-[#00df82] transition"
          >
            <span>✏️ {hasBudget ? "Ubah" : "Atur"}</span>
          </button>
        </div>
      </div>

      {/* Form Dialog / Inline Edit Anggaran (FR-BUD-08: Otorisasi & Akses Mandiri) */}
      {isEditing && (
        <form
          action={handleSubmit}
          className="mb-5 rounded-2xl border border-emerald-500/30 bg-[#091224] p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">
              Tentukan Anggaran Bulanan Anda (Bulan {currentMonthName})
            </span>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕ Batal
            </button>
          </div>

          <input type="hidden" name="month" value={month} />
          <input type="hidden" name="year" value={year} />

          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-bold text-slate-500">
                Rp
              </span>
              <input
                type="number"
                name="amount"
                defaultValue={budgetAmount || ""}
                placeholder="Contoh: 1500000"
                min="1000"
                step="1000"
                required
                className="w-full rounded-xl border border-slate-700 bg-[#070e20] py-2 pl-9 pr-3 text-sm font-bold text-white placeholder-slate-500 focus:border-[#00df82] focus:outline-none focus:ring-2 focus:ring-[#00df82]/20"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-[#00df82] px-4 py-2 text-xs font-black text-slate-950 hover:bg-[#05f196] disabled:opacity-50 transition"
            >
              {isPending ? "Menyimpan..." : "Simpan Anggaran"}
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            * Anggaran ini disimpan aman dan hanya dapat diakses oleh akun Anda sendiri.
          </p>
        </form>
      )}

      {hasBudget ? (
        <div className="space-y-4">
          {/* Progress Bar & Persentase (FR-BUD-06 & FR-BUD-07) */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-400">Penggunaan Anggaran</span>
              <span className={`text-sm font-black tabular-nums ${statusInfo.textClass}`}>
                {usagePercentage}%
              </span>
            </div>

            {/* Track Progress Bar */}
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-900 border border-slate-800/80 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${statusInfo.progressBarClass}`}
                style={{ width: `${progressWidth}%` }}
              />
            </div>
          </div>

          {/* Rincian Finansial Anggaran */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/60 text-xs">
            {/* Total Terpakai */}
            <div className="rounded-xl bg-[#091224] p-3 border border-slate-800/60">
              <span className="text-[11px] text-slate-400">Total Pengeluaran</span>
              <p className="text-sm font-bold text-rose-400 tabular-nums mt-0.5">
                {formatRupiah(totalExpense)}
              </p>
            </div>

            {/* Target Anggaran */}
            <div className="rounded-xl bg-[#091224] p-3 border border-slate-800/60">
              <span className="text-[11px] text-slate-400">Batas Anggaran</span>
              <p className="text-sm font-bold text-white tabular-nums mt-0.5">
                {formatRupiah(budgetAmount)}
              </p>
            </div>

            {/* Sisa Anggaran */}
            <div className="rounded-xl bg-[#091224] p-3 border border-slate-800/60">
              <span className="text-[11px] text-slate-400">Sisa Anggaran</span>
              <p
                className={`text-sm font-bold tabular-nums mt-0.5 ${
                  remainingAmount >= 0 ? "text-[#00df82]" : "text-rose-400"
                }`}
              >
                {formatRupiah(remainingAmount)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-[#091224]/50 p-5 text-center">
          <p className="text-xs text-slate-400">
            Anda belum menentukan target anggaran bulanan untuk periode {currentMonthName} {year}.
          </p>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="mt-3 inline-flex items-center gap-1 rounded-xl bg-[#00df82] px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-[#05f196] transition"
            >
              <span>+ Atur Anggaran Sekarang</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}