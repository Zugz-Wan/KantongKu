"use client";

import { useTransition } from "react";
import { logoutAction } from "@/app/actions/auth";
import { LogOut, Loader2 } from "lucide-react";

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className={
        className ||
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700/60 hover:border-rose-500/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      }
      title="Keluar dari akun"
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <LogOut className="w-3.5 h-3.5" />
      )}
      <span>{isPending ? "Keluar..." : "Logout"}</span>
    </button>
  );
}
