"use client";

import { useState } from "react";
import { saveBudget } from "@/app/actions/budget";

interface BudgetFormProps {
  currentMonth: string; // "YYYY-MM"
  initialAmount?: number;
  initialNotes?: string | null;
  isEditMode?: boolean;
  onCancel?: () => void;
}

export function BudgetForm({
  currentMonth,
  initialAmount = 0,
  initialNotes = "",
  isEditMode = false,
  onCancel,
}: BudgetFormProps) {
  const [amount, setAmount] = useState<string>(
    initialAmount > 0 ? initialAmount.toString() : ""
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [notes, setNotes] = useState<string>(initialNotes || "");

  // Preset rekomendasi anggaran bulanan mahasiswa
  const presets = [500000, 1000000, 1500000, 2000000, 2500000, 3000000];

  const formatRupiahPreview = (numStr: string) => {
    const val = parseFloat(numStr);
    if (isNaN(val) || val <= 0) return null;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <form action={saveBudget} className="space-y-5">
      {/* Pilihan Bulan (FR-BUD-01 & FR-BUD-03) */}
      <div>
        <label
          htmlFor="month"
          className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2"
        >
          Bulan Anggaran <span className="text-rose-400">*</span>
        </label>
        <div className="relative">
          <input
            type="month"
            id="month"
            name="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            required
            className="block w-full rounded-2xl border border-slate-800 bg-[#091224] py-3 px-4 text-sm font-bold text-white focus:border-[#00df82] focus:outline-none focus:ring-4 focus:ring-[#00df82]/15 transition cursor-pointer"
          />
        </div>
        <p className="text-[11px] text-slate-400 mt-1.5">
          Pilih bulan dan tahun untuk batas pagu pengeluaran ini
        </p>
      </div>

      {/* Nominal Anggaran (FR-BUD-01 & FR-BUD-02) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="amount"
            className="block text-xs font-bold uppercase tracking-wider text-slate-400"
          >
            {isEditMode ? "Ubah Nominal Anggaran" : "Nominal Pagu Anggaran"}{" "}
            <span className="text-rose-400">*</span>
          </label>
          {amount && formatRupiahPreview(amount) && (
            <span className="text-xs font-black text-[#00df82]">
              {formatRupiahPreview(amount)}
            </span>
          )}
        </div>

        <div className="relative rounded-2xl shadow-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <span className="text-base font-bold text-slate-500">Rp</span>
          </div>
          <input
            type="number"
            id="amount"
            name="amount"
            min="1000"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            required
            className="block w-full rounded-2xl border border-slate-800 bg-[#091224] py-3.5 pl-12 pr-4 text-xl font-black tracking-tight text-white placeholder-slate-500 focus:border-[#00df82] focus:outline-none focus:ring-4 focus:ring-[#00df82]/15 transition"
          />
        </div>

        {/* Tombol Preset Cepat */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 mr-1">Rekomendasi Cepat:</span>
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setAmount(p.toString())}
              className="rounded-lg border border-slate-800 bg-[#070e20] px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:border-[#00df82]/50 hover:text-[#00df82] transition shadow-2xs"
            >
              {(p / 1000000).toFixed(p % 1000000 === 0 ? 0 : 1)} Jt
            </button>
          ))}
        </div>
      </div>

      {/* Catatan / Keterangan (Opsional) */}
      <div>
        <label
          htmlFor="notes"
          className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2"
        >
          Catatan / Alokasi Sasaran <span className="text-slate-500 font-normal lowercase">(opsional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Contoh: Fokus hemat untuk bayar SPP & praktikum, batasi makan di luar"
          className="block w-full rounded-2xl border border-slate-800 bg-[#091224] p-3.5 text-sm text-white placeholder-slate-500 focus:border-[#00df82] focus:outline-none focus:ring-4 focus:ring-[#00df82]/15 transition resize-none"
        />
      </div>

      {/* Tombol Aksi */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 transition"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-[#00df82] px-6 py-2.5 text-sm font-black text-slate-950 shadow-md shadow-[#00df82]/20 hover:bg-[#05f196] focus:outline-none focus:ring-4 focus:ring-[#00df82]/25 transition active:scale-98"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>{isEditMode ? "Simpan Perubahan Anggaran" : "Tetapkan Anggaran"}</span>
        </button>
      </div>
    </form>
  );
}
