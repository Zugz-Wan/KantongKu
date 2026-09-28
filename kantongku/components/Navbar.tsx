import Link from "next/link";
import { cookies } from "next/headers";
import { toggleThemePreference } from "@/app/actions/preference";

interface NavbarProps {
  userName?: string;
}

export async function Navbar({ userName }: NavbarProps) {
  const cookieStore = await cookies();
  const currentTheme = cookieStore.get("theme")?.value || "dark";

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "YK";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#040817]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="group flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00df82] text-slate-950 shadow-md shadow-[#00df82]/20 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Kantong<span className="text-[#00df82]">Ku</span>
            </span>
          </Link>

          {/* Navigation Links (Deliverable: Layout dasar + navbar) */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-semibold">
            <Link
              href="/dashboard"
              className="rounded-lg px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/transactions"
              className="rounded-lg px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              Riwayat Transaksi
            </Link>
            <Link
              href="/transactions/new"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-950/60 px-3.5 py-2 text-xs font-bold text-[#00df82] hover:bg-emerald-900/60 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>+ Catat Transaksi</span>
            </Link>
          </nav>
        </div>

        {/* Right side: Cookies Preferences (F-10), User Info, & Logout (dari Programmer 1) */}
        <div className="flex items-center gap-3">
          {/* F-10 Cookies Preferensi: Tombol Toggle Tema via next/headers */}
          <form action={toggleThemePreference}>
            <button
              type="submit"
              title={`Ubah tema ke mode ${currentTheme === "dark" ? "terang" : "gelap"}`}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-[#091224] text-slate-300 hover:bg-slate-800 hover:text-white transition shadow-xs"
            >
              {currentTheme === "dark" ? (
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </form>

          {/* User Profile Info */}
          {userName && (
            <div className="hidden sm:flex items-center gap-2.5 rounded-xl border border-slate-800 bg-[#081022] py-1 pl-1.5 pr-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00df82] text-xs font-black text-slate-950">
                {initials}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white max-w-[150px] truncate leading-tight">
                  {userName}
                </span>
                <span className="text-[10px] text-slate-400 leading-tight">
                  Mahasiswa
                </span>
              </div>
            </div>
          )}

          {/* Tombol Logout (Deliverable: tombol logout disiapkan untuk integrasi Programmer 1) */}
          <form action="/login">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-900/40 bg-rose-950/20 px-3 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-900/40 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}