interface CategoryExpenseItem {
  category: string;
  amount: number;
  percentageOfTotalExpense: number;
}

interface BudgetCategoryListProps {
  categoryExpenses: CategoryExpenseItem[];
  totalExpense: number;
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

export function BudgetCategoryList({
  categoryExpenses,
  totalExpense,
}: BudgetCategoryListProps) {
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (categoryExpenses.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-[#070e20]/80 p-6 text-center shadow-xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-xl mx-auto mb-2 border border-slate-800">
          🛒
        </div>
        <h3 className="text-xs font-bold text-white">Belum Ada Pengeluaran</h3>
        <p className="mt-1 text-[11px] text-slate-400">
          Belum ada catatan pengeluaran di bulan ini.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#070e20]/80 p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">
            Distribusi Pengeluaran per Kategori
          </h3>
          <p className="text-[11px] text-slate-400">
            Rincian ke mana uang keluar di bulan ini
          </p>
        </div>
        <span className="text-xs font-black text-rose-400">
          {formatRupiah(totalExpense)}
        </span>
      </div>

      <div className="space-y-3 pt-1">
        {categoryExpenses.map((item) => {
          const icon = getCategoryIcon(item.category);
          return (
            <div key={item.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 border border-slate-800 text-xs">
                    {icon}
                  </span>
                  <span className="font-semibold text-slate-200">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-right">
                  <span className="font-black text-white tabular-nums">
                    {formatRupiah(item.amount)}
                  </span>
                  <span className="text-[10px] text-slate-400 min-w-[35px]">
                    ({item.percentageOfTotalExpense.toFixed(0)}%)
                  </span>
                </div>
              </div>

              {/* Mini progress bar */}
              <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full rounded-full bg-rose-500/80 transition-all"
                  style={{ width: `${Math.min(item.percentageOfTotalExpense, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
