'use client';

import { Suspense, useActionState, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { loginAction } from '@/app/actions/auth';
import { AuthState } from '@/lib/types/user';
import { 
  Wallet, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  ShieldCheck 
} from 'lucide-react';

const initialState: AuthState = {};

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';

  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white">Selamat Datang Kembali</h3>
        <p className="text-xs text-slate-400 mt-1">
          Masukkan email dan password untuk mengakses kantong keuanganmu.
        </p>
      </div>

      {/* Notifikasi jika dialihkan oleh middleware */}
      {searchParams.get('redirect') && (
        <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-amber-300 text-xs">
          <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Halaman tersebut memerlukan autentikasi. Silakan login terlebih dahulu.</span>
        </div>
      )}

      {/* Alert Error Login */}
      {state?.error && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {/* Hidden input untuk target redirect */}
        <input type="hidden" name="redirect" value={redirectTarget} />

        {/* Input Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1.5">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="nama@kampus.ac.id"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500 transition-all"
            />
          </div>
          {state?.fieldErrors?.email && (
            <p className="mt-1 text-xs text-rose-400">{state.fieldErrors.email[0]}</p>
          )}
        </div>

        {/* Input Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-xs font-medium text-slate-300">
              Password
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {state?.fieldErrors?.password && (
            <p className="mt-1 text-xs text-rose-400">{state.fieldErrors.password[0]}</p>
          )}
        </div>

        {/* Tombol Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Footer Link ke Register */}
      <div className="mt-6 border-t border-slate-800 pt-4 text-center">
        <p className="text-xs text-slate-400">
          Belum punya akun?{' '}
          <Link
            href="/register"
            className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Daftar akun gratis
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center items-center gap-2 mb-2">
          <div className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl shadow-lg shadow-emerald-500/20 text-slate-950">
            <Wallet className="w-8 h-8 stroke-[2.5]" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-white">
          Kantong<span className="text-emerald-400">Ku</span>
        </h2>
        <p className="mt-1 text-center text-sm text-slate-400">
          Kelola uang saku mahasiswa dengan bijak & terencana
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <Suspense fallback={
          <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-700/60 text-center text-slate-400">
            Memuat form login...
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
