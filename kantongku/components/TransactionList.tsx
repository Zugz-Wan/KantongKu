import Link from "next/link";

export interface TransactionItem {
  id: string;
  type: string;
  amount: number;
  category: string;
  description: string | null;
  date: Date;
  createdAt: Date;
}

interface TransactionListProps {
  transactions: TransactionItem[];
  emptyMessage?: string;
  showAddButton?: boolean;
}

const getCategoryIcon = (category: string) => {
  const c = category.toLowerCase();
  if (c.includes("makan") || c.includes("minum") || c.includes("food")) return "🍔";
  if (c.includes("trans") || c.includes("ojol") || c.includes("bensin")) return "🛵";
  if (c.includes("gaji") || c.includes("upah") || c.includes("salary")) return "💼";
  if (c.includes("saku") || c.includes("ortu") || c.includes("allowance")) return "💵";
  if (c.includes("kuliah") || c.includes("didik") || c.includes("buku")) return "📚";
  if (c.includes("belanja") || c.includes("shop")) return "🛍️";
  if (c.includes("hiburan") || c.includes("game") || c.includes("nonton")) return "🎮";
  if (c.includes("kost") || c.includes("tagihan") || c.includes("listrik")) return "🏠";
  if (c.includes("sehat") || c.includes("obat")) return "💊";
  return "🏷️";
};

export function TransactionList({
  transactions,
  emptyMessage = "Belum ada riwayat transaksi yang tercatat.",
  showAddButton = true,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-[#070e20]/60 px-6 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-2xl mb-3 border border-slate-800 shadow-xs">
          📋
        </div>
        <h3 className="text-sm font-bold text-white">Tidak ada data</h3>
        <p className="mt-1 text-xs text-slate-400 max-w-sm">
          {emptyMessage}
        </p>
        {showAddButton && (
          <Link
            href="/transactions/new"
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#00df82] px-4 py-2 text-xs font-black text-slate-950 shadow-md shadow-[#00df82]/20 hover:bg-[#05f196] transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>Catat Transaksi Sekarang</span>
          </Link>
        )}
      </div>
    );
  }

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#070e20]/80 shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-800 bg-[#091224] text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th scope="col" className="px-5 py-3.5">Tanggal</th>
              <th scope="col" className="px-5 py-3.5">Kategori</th>
              <th scope="col" className="px-5 py-3.5">Keterangan</th>
              <th scope="col" className="px-5 py-3.5 text-center">Jenis</th>
              <th scope="col" className="px-5 py-3.5 text-right">Nominal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {transactions.map((t) => {
              const isIncome = t.type === "income";
              const icon = getCategoryIcon(t.category);
              return (
                <tr
                  key={t.id}
                  className="group hover:bg-slate-800/40 transition-colors"
                >
                  {/* Tanggal */}
                  <td className="whitespace-nowrap px-5 py-4 text-xs font-semibold text-slate-300">
                    {formatDate(t.date)}
                  </td>

                  {/* Kategori dengan Icon */}
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-sm">
                        {icon}
                      </span>
                      <span className="font-bold text-white text-xs sm:text-sm">
                        {t.category}
                      </span>
                    </div>
                  </td>

                  {/* Keterangan */}
                  <td className="px-5 py-4 text-xs text-slate-400 max-w-xs truncate">
                    {t.description ? (
                      <span>{t.description}</span>
                    ) : (
                      <span className="italic text-slate-600">-</span>
                    )}
                  </td>

                  {/* Jenis (Badge) */}
                  <td className="whitespace-nowrap px-5 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        isIncome
                          ? "bg-emerald-950/70 text-[#00df82] border border-emerald-500/20"
                          : "bg-rose-950/70 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      <span>{isIncome ? "⬇ Pemasukan" : "⬆ Pengeluaran"}</span>
                    </span>
                  </td>

                  {/* Nominal */}
                  <td
                    className={`whitespace-nowrap px-5 py-4 text-right font-black tabular-nums text-sm sm:text-base ${
                      isIncome
                        ? "text-[#00df82]"
                        : "text-rose-400"
                    }`}
                  >
                    {isIncome ? "+" : "-"} {formatRupiah(t.amount)}
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