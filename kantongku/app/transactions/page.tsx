import Link from "next/link";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { TransactionList } from "@/components/TransactionList";
import { setDefaultFilterPreference } from "@/app/actions/preference";

export const dynamic = "force-dynamic";

interface TransactionsPageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    return <div>Memuat data pengguna...</div>;
  }

  // F-10 Cookies Preferensi: Membaca filter default via next/headers
  const cookieStore = await cookies();
  const defaultFilterFromCookie = cookieStore.get("default_filter")?.value || "all";

  // Parameter URL memiliki prioritas jika pengguna sedang mengklik filter tertentu
  const resolvedSearchParams = await searchParams;
  const activeFilter = resolvedSearchParams.filter || defaultFilterFromCookie;

  // Filter query transaksi
  const whereClause: { userId: string; type?: string } = {
    userId: user.id,
  };
  if (activeFilter === "income" || activeFilter === "expense") {
    whereClause.type = activeFilter;
  }

  const transactions = await prisma.transaction.findMany({
    where: whereClause,
    orderBy: { date: "desc" },
  });

  const allCount = await prisma.transaction.count({ where: { userId: user.id } });
  const incomeCount = await prisma.transaction.count({ where: { userId: user.id, type: "income" } });
  const expenseCount = await prisma.transaction.count({ where: { userId: user.id, type: "expense" } });

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Riwayat Transaksi
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Daftar lengkap seluruh histori pengeluaran dan pemasukan Anda
          </p>
        </div>

        <Link
          href="/transactions/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00df82] px-5 py-2.5 text-sm font-extrabold text-slate-950 shadow-md shadow-[#00df82]/20 hover:bg-[#05f196] hover:scale-105 active:scale-98 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Catat Transaksi</span>
        </Link>
      </div>

      {/* Filter Tabs & Preferensi Default (F-10) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-800 bg-[#070e20]/80 p-2.5 shadow-2xs">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Link
            href="/transactions?filter=all"
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeFilter === "all"
                ? "bg-[#00df82] text-slate-950 shadow-xs"
                : "text-slate-300 hover:bg-slate-800/80"
            }`}
          >
            <span>Semua</span>
            <span className={`rounded-md px-1.5 py-0.2 text-[10px] ${
              activeFilter === "all" ? "bg-slate-950/20 text-slate-950" : "bg-slate-800 text-slate-300"
            }`}>
              {allCount}
            </span>
          </Link>

          <Link
            href="/transactions?filter=income"
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeFilter === "income"
                ? "bg-[#00df82] text-slate-950 shadow-xs"
                : "text-slate-300 hover:bg-slate-800/80"
            }`}
          >
            <span>💰 Pemasukan</span>
            <span className={`rounded-md px-1.5 py-0.2 text-[10px] ${
              activeFilter === "income" ? "bg-slate-950/20 text-slate-950" : "bg-slate-800 text-slate-300"
            }`}>
              {incomeCount}
            </span>
          </Link>

          <Link
            href="/transactions?filter=expense"
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeFilter === "expense"
                ? "bg-rose-500 text-white shadow-xs"
                : "text-slate-300 hover:bg-slate-800/80"
            }`}
          >
            <span>💸 Pengeluaran</span>
            <span className={`rounded-md px-1.5 py-0.2 text-[10px] ${
              activeFilter === "expense" ? "bg-white/20" : "bg-slate-800 text-slate-300"
            }`}>
              {expenseCount}
            </span>
          </Link>
        </div>

        {/* F-10: Simpan Filter ini sebagai Cookie Preferensi Default */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-slate-400 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
          <span className="text-[11px]">
            Default cookie: <strong className="text-white uppercase">{defaultFilterFromCookie}</strong>
          </span>

          {activeFilter !== defaultFilterFromCookie && (
            <form
              action={async () => {
                "use server";
                await setDefaultFilterPreference(activeFilter);
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-[11px] font-bold text-slate-200 hover:border-[#00df82] hover:text-[#00df82] transition shadow-2xs"
              >
                <span>⭐ Jadikan Default</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Tabel Riwayat Transaksi */}
      <TransactionList
        transactions={transactions}
        emptyMessage={
          activeFilter === "all"
            ? "Belum ada catatan riwayat transaksi."
            : `Tidak ditemukan transaksi dengan tipe ${activeFilter === "income" ? "pemasukan" : "pengeluaran"}.`
        }
      />
    </div>
  );
}