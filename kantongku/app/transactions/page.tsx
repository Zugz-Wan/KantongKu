import Link from 'next/link';
import { getSession } from '@/lib/session';
import { logoutAction } from '@/app/actions/auth';
import { 
  Wallet, 
  LogOut, 
  ArrowRightLeft, 
  LayoutDashboard, 
  ShieldCheck,
  PlusCircle,
  Receipt
} from 'lucide-react';

export default async function TransactionsPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl text-slate-950">
                <Wallet className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-bold text-lg text-white">
                Kantong<span className="text-emerald-400">Ku</span>
              </span>
            </Link>

            <div className="hidden sm:flex items-center gap-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>
              <Link
                href="/transactions"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Transaksi
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-white">{session?.name || 'Mahasiswa'}</span>
              <span className="text-[11px] text-slate-400">{session?.email}</span>
            </div>
            
            {/* Form Logout (F-12) */}
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700/60 hover:border-rose-500/30 transition-all cursor-pointer"
                title="Keluar dari akun"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Route Terproteksi: /transactions
            </div>
            <h1 className="text-2xl font-bold text-white">Daftar Transaksi</h1>
            <p className="text-sm text-slate-400 mt-1">
              Halaman ini juga diproteksi oleh <code className="text-emerald-400 font-mono">middleware.ts</code> (F-03).
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-semibold rounded-xl text-xs shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-opacity"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Transaksi Baru</span>
          </button>
        </div>

        {/* Placeholder / Empty State for Programmer 2 / 3 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">Belum Ada Transaksi</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Modul transaksi ini siap dikembangkan oleh Programmer tim dengan memanfaatkan sesi user yang sudah aktif.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Kembali ke Dashboard</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
