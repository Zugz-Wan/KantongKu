import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { TransactionList } from "@/components/TransactionList";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    return <div className="text-center py-12 text-slate-400">Memuat data pengguna...</div>;
  }

  // Mengambil seluruh transaksi milik user untuk agregasi
  const allTransactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  // Agregasi F-04: saldo = total income - total expense
  const totalIncome = allTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = allTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Transaksi terbaru (5 transaksi terakhir)
  const recentTransactions = allTransactions.slice(0, 5);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isSurplus = balance >= 0;

  return (
    <div className="relative space-y-8">
      {/* Background subtle ambient glow */}
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-[260px] w-[500px] rounded-full bg-emerald-500/10 blur-[130px]" />

      {/* Header Banner (Mengadopsi tipografi & badge dari referensi) */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-5 border-b border-slate-800/80 pb-6">
        <div>
          {/* Badge khas referensi */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-semibold text-[#00df82] backdrop-blur-md shadow-xs mb-3">
            <svg className="w-3.5 h-3.5 text-[#00df82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Manajemen Finansial Khusus Mahasiswa</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Halo, {user.name} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Pantau arus kas, uang saku harian, dan ringkasan keuangan pribadimu.
          </p>
        </div>

        <Link
          href="/transactions/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00df82] px-5 py-2.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-[#00df82]/20 hover:bg-[#05f196] hover:scale-105 active:scale-98 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>+ Catat Transaksi Baru</span>
        </Link>
      </div>

      {/* Grid Kartu Ringkasan (F-04 Dashboard) */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Kartu Saldo Utama (Hero Card) */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-[#07181c] via-[#09152a] to-[#080f20] p-6 text-white shadow-xl shadow-emerald-950/20">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00df82]">
                Saldo Saat Ini
              </span>
              <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-950/80 px-2.5 py-0.5 text-[11px] font-bold text-[#00df82]">
                {isSurplus ? "✓ Surplus / Aman" : "⚠ Defisit"}
              </span>
            </div>

            <div className="my-4">
              <p className="text-3xl sm:text-4xl font-black tracking-tight tabular-nums text-white">
                {formatRupiah(balance)}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                (Total Pemasukan − Total Pengeluaran)
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>{allTransactions.length} total transaksi</span>
              <Link href="/transactions" className="hover:text-[#00df82] font-semibold flex items-center gap-1 transition">
                <span>Lihat riwayat</span> &rarr;
              </Link>
            </div>
          </div>

          {/* Ambient glow decoration */}
          <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-[#00df82]/10 blur-xl pointer-events-none" />
        </div>

        {/* Total Pemasukan */}
        <div className="rounded-3xl border border-slate-800/90 bg-[#070e20]/80 p-6 shadow-xs flex flex-col justify-between backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00df82]">
              Total Pemasukan
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-950/80 border border-emerald-500/20 text-[#00df82] text-sm">
              💰
            </span>
          </div>

          <div className="my-3">
            <p className="text-2xl sm:text-3xl font-black text-[#00df82] tabular-nums">
              {formatRupiah(totalIncome)}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Akumulasi pemasukan / uang masuk
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
            {allTransactions.filter((t) => t.type === "income").length} transaksi pemasukan
          </div>
        </div>

        {/* Total Pengeluaran */}
        <div className="rounded-3xl border border-slate-800/90 bg-[#070e20]/80 p-6 shadow-xs flex flex-col justify-between backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Total Pengeluaran
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-950/80 border border-rose-500/20 text-rose-400 text-sm">
              💸
            </span>
          </div>

          <div className="my-3">
            <p className="text-2xl sm:text-3xl font-black text-rose-400 tabular-nums">
              {formatRupiah(totalExpense)}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Akumulasi pengeluaran Anda
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
            {allTransactions.filter((t) => t.type === "expense").length} transaksi pengeluaran
          </div>
        </div>
      </div>

      {/* Bagian Transaksi Terbaru (F-04: 5 transaksi terakhir) */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">
              Transaksi Terbaru
            </h2>
            <p className="text-xs text-slate-400">
              5 catatan transaksi keuangan terakhir Anda
            </p>
          </div>
          <Link
            href="/transactions"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#00df82] hover:text-[#05f196] transition"
          >
            <span>Semua Riwayat Transaksi</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <TransactionList
          transactions={recentTransactions}
          emptyMessage="Belum ada transaksi. Klik tombol di atas untuk mencatat pemasukan atau pengeluaran pertama Anda!"
        />
      </div>
    </div>
  );
}