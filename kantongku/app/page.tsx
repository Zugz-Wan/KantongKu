import Link from 'next/link';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { 
  Wallet, 
  ArrowRight, 
  ShieldCheck, 
  PieChart, 
  Sparkles, 
  CheckCircle2,
  Lock
} from 'lucide-react';

export default async function HomePage() {
  const session = await getSession();
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl text-slate-950">
              <Wallet className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-bold text-lg text-white">
              Kantong<span className="text-emerald-400">Ku</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold px-4 py-2 text-slate-300 hover:text-white transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="text-xs font-semibold px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-all shadow-md shadow-emerald-500/20"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-600/20 via-teal-500/10 to-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Manajemen Finansial Khusus Mahasiswa</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Atur Uang Sakumu, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Bebas Khawatir di Akhir Bulan
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            Catat pemasukan, pengeluaran harian, dan pantau tabungan dengan mudah. Data aman dengan sistem autentikasi modern.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Mulai Sekarang</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Masuk ke Akun</span>
            </Link>
          </div>

          {/* Value Props */}
          <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
              <h3 className="text-sm font-semibold text-white">Sesi Aman & Terenkripsi</h3>
              <p className="text-xs text-slate-400 mt-1">
                Password di-hash bcrypt dan cookie session bertanda tangan JWT.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <PieChart className="w-5 h-5 text-teal-400 mb-2" />
              <h3 className="text-sm font-semibold text-white">Rute Terproteksi</h3>
              <p className="text-xs text-slate-400 mt-1">
                Dashboard & modul transaksi dilindungi oleh Next.js middleware.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 mb-2" />
              <h3 className="text-sm font-semibold text-white">Prisma-Ready</h3>
              <p className="text-xs text-slate-400 mt-1">
                Skema tabel Users sudah siap di-migrate begitu DB siap disambungkan.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} KantongKu. Proyek Praktikum Pengembangan Perangkat Lunak.
      </footer>
    </div>
  );
}
