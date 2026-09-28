import Link from "next/link";
import { Budget } from "@/lib/types/budget";

interface BudgetHistoryTableProps {
  budgets: Budget[];
  activeMonth: string; // "YYYY-MM"
}

export function BudgetHistoryTable({
  budgets,
  activeMonth,
}: BudgetHistoryTableProps) {
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatMonthName = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    return new Intl.DateTimeFormat("id-ID", {
      month: "long",
      year: "numeric",
    }).format(d);
  };

  if (budgets.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#070e20]/80 p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">
            Riwayat Target Anggaran Semua Bulan
          </h3>
          <p className="text-[11px] text-slate-400">
            Daftar seluruh pagu anggaran yang telah Anda tetapkan
          </p>
        </div>
        <span className="text-xs font-bold text-slate-400">
          {budgets.length} Bulan Tercatat
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-[#091224] text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3">Bulan</th>
              <th className="px-4 py-3">Nominal Pagu</th>
              <th className="px-4 py-3">Catatan</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {budgets.map((b) => {
              const isSelected = b.month === activeMonth;
              return (
                <tr
                  key={b.id}
                  className={`group transition-colors ${
                    isSelected
                      ? "bg-emerald-950/30 border-l-2 border-[#00df82]"
                      : "hover:bg-slate-800/40"
                  }`}
                >
                  <td className="whitespace-nowrap px-4 py-3.5 font-bold text-white capitalize">
                    {formatMonthName(b.month)}
                    {isSelected && (
                      <span className="ml-2 rounded-md bg-[#00df82]/20 px-1.5 py-0.5 text-[9px] font-black text-[#00df82]">
                        Sedang Dilihat
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 font-black text-[#00df82] tabular-nums">
                    {formatRupiah(b.amount)}
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 max-w-xs truncate">
                    {b.notes || <span className="italic text-slate-600">-</span>}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right">
                    <Link
                      href={`/budget?month=${b.month}`}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                        isSelected
                          ? "bg-[#00df82] text-slate-950 shadow-xs"
                          : "border border-slate-700 bg-slate-800 text-slate-200 hover:border-[#00df82] hover:text-[#00df82]"
                      }`}
                    >
                      <span>{isSelected ? "Dipilih" : "Buka Bulan Ini"}</span>
                      <span>&rarr;</span>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
