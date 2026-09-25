import Link from 'next/link';
import { getSession, getCurrentUserId, getCurrentUser } from '@/lib/session';
import { logoutAction } from '@/app/actions/auth';
import { 
  Wallet, 
  User, 
  Mail, 
  Key, 
  LogOut, 
  ShieldCheck, 
  ArrowRightLeft, 
  LayoutDashboard,
  Code2
} from 'lucide-react';

export default async function DashboardPage() {
  // Verifikasi helper yang disiapkan untuk Programmer 2 & 3
  const session = await getSession();
  const currentUserId = await getCurrentUserId();
  const currentUser = await getCurrentUser();

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
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>
              <Link
                href="/transactions"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
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
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-900/40 via-teal-900/20 to-slate-900/60 border border-emerald-500/30 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Sesi Terverifikasi (HTTP-Only Signed Cookie)
              </div>
              <h1 className="text-2xl font-bold text-white">
                Halo, {currentUser?.name || session?.name}! 👋
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Selamat datang di KantongKu. Halaman ini dilindungi oleh <code className="text-emerald-400 font-mono">middleware.ts</code>.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/transactions"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl text-xs transition-colors flex items-center gap-2"
              >
                <span>Buka Route /transactions</span>
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Developer Info Box for Programmer 2 & 3 */}
        <div className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Integrasi untuk Programmer 2 & 3
              </h2>
              <p className="text-xs text-slate-400">
                Nilai yang dihasilkan helper <code className="text-indigo-300 font-mono">getSession()</code> dan <code className="text-indigo-300 font-mono">getCurrentUserId()</code>:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* User ID */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Key className="w-4 h-4 text-emerald-400" />
                <span>getCurrentUserId()</span>
              </div>
              <div className="font-mono text-xs text-emerald-300 font-semibold truncate" title={currentUserId || ''}>
                {currentUserId || 'null'}
              </div>
            </div>

            {/* User Name */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <User className="w-4 h-4 text-teal-400" />
                <span>session.name</span>
              </div>
              <div className="text-xs text-white font-medium truncate">
                {session?.name || '-'}
              </div>
            </div>

            {/* User Email */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>session.email</span>
              </div>
              <div className="text-xs text-white font-medium truncate">
                {session?.email || '-'}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
            <span className="text-slate-500">// Contoh penggunaan di Server Component / Server Action:</span><br />
            <span className="text-indigo-400">import</span> &#123; getSession, getCurrentUserId &#125; <span className="text-indigo-400">from</span> <span className="text-emerald-300">&apos;@/lib/session&apos;</span>;<br />
            <span className="text-indigo-400">const</span> userId = <span className="text-indigo-400">await</span> getCurrentUserId();
          </div>
        </div>
      </main>
    </div>
  );
}
