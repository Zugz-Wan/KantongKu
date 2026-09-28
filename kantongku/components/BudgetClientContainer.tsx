"use client";

import { useState } from "react";
import { MonthlyBudgetData, Budget } from "@/lib/types/budget";
import { BudgetMonthSelector } from "@/components/BudgetMonthSelector";
import { BudgetOverviewCard } from "@/components/BudgetOverviewCard";
import { BudgetForm } from "@/components/BudgetForm";
import { BudgetCategoryList } from "@/components/BudgetCategoryList";
import { BudgetHistoryTable } from "@/components/BudgetHistoryTable";

interface BudgetClientContainerProps {
  monthlyData: MonthlyBudgetData;
  allBudgets: Budget[];
  currentMonth: string; // "YYYY-MM"
  statusNotification?: string | null;
}

export function BudgetClientContainer({
  monthlyData,
  allBudgets,
  currentMonth,
  statusNotification,
}: BudgetClientContainerProps) {
  const [showFormModal, setShowFormModal] = useState<boolean>(false);

  const hasBudget = monthlyData.budgetAmount > 0;

  return (
    <div className="space-y-6">
      {/* Notifikasi Status Aksi */}
      {statusNotification === "saved" && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-xs font-bold text-[#00df82] backdrop-blur-md shadow-xs animate-in fade-in duration-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>Anggaran bulanan berhasil disimpan! Pagu dan rincian telah diperbarui.</span>
        </div>
      )}

      {/* 1. Header & Selektor Bulan (FR-BUD-03) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Anggaran Bulanan
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tetapkan batas pagu pengeluaran per bulan agar bebas cemas di akhir bulan
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowFormModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00df82] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-slate-950 shadow-md shadow-[#00df82]/20 hover:bg-[#05f196] hover:scale-105 active:scale-98 transition cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>{hasBudget ? "Ubah Nominal Anggaran" : "Buat Anggaran Baru"}</span>
        </button>
      </div>

      {/* 2. Selektor Bulan Aktif (FR-BUD-03) */}
      <BudgetMonthSelector currentMonth={currentMonth} />

      {/* 3. Kartu Overview Anggaran Bulan Terpilih (FR-BUD-03) */}
      <BudgetOverviewCard
        data={monthlyData}
        onOpenEditModal={() => setShowFormModal(true)}
      />

      {/* 4. Grid Detail: Distribusi Kategori & Riwayat Seluruh Bulan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetCategoryList
          categoryExpenses={monthlyData.categoryExpenses}
          totalExpense={monthlyData.totalExpense}
        />

        <BudgetHistoryTable
          budgets={allBudgets}
          activeMonth={currentMonth}
        />
      </div>

      {/* Modal / Popup Formulir Tambah & Ubah Anggaran (FR-BUD-01 & FR-BUD-02) */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div
            className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-[#070e20] p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-black text-white">
                  {hasBudget ? "Ubah Nominal Anggaran" : "Tetapkan Anggaran Baru"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {hasBudget
                    ? "Perbarui besaran pagu pengeluaran untuk bulan yang dipilih"
                    : "Buat target batas pengeluaran untuk mengontrol keuangan bulanan"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Formulir Budget */}
            <BudgetForm
              currentMonth={currentMonth}
              initialAmount={monthlyData.budgetAmount}
              initialNotes={monthlyData.budget?.notes || ""}
              isEditMode={hasBudget}
              onCancel={() => setShowFormModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
