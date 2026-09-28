import Link from "next/link";
import { TransactionForm } from "@/components/TransactionForm";

export default function NewTransactionPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Halaman */}
      <div>
        <Link
          href="/transactions"
          className="group inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#00df82] mb-3 transition"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">&larr;</span>
          <span>Kembali ke Riwayat Transaksi</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Catat Transaksi Baru
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Masukkan detail pengeluaran atau pemasukan keuangan pribadi Anda
        </p>
      </div>

      {/* Card Formulir */}
      <div className="rounded-3xl border border-slate-800 bg-[#070e20]/90 p-6 sm:p-8 shadow-xl shadow-emerald-950/20">
        <TransactionForm />
      </div>
    </div>
  );
}