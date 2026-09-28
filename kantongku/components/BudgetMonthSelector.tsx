"use client";

import { useRouter } from "next/navigation";

interface BudgetMonthSelectorProps {
  currentMonth: string; // "YYYY-MM"
}

export function BudgetMonthSelector({ currentMonth }: BudgetMonthSelectorProps) {
  const router = useRouter();

  const [yearStr, monthStr] = currentMonth.split("-");
  const year = parseInt(yearStr, 10);
  const monthNum = parseInt(monthStr, 10);

  // Format nama bulan dalam Bahasa Indonesia
  const dateObj = new Date(year, monthNum - 1, 1);
  const monthNameFormatted = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(dateObj);

  // Bulan saat ini (sistem)
  const today = new Date();
  const currentActualMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const isActualCurrentMonth = currentMonth === currentActualMonth;

  // Navigasi bulan sebelumnya
  const handlePrevMonth = () => {
    let prevYear = year;
    let prevMonth = monthNum - 1;
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear -= 1;
    }
    const formatted = `${prevYear}-${String(prevMonth).padStart(2, "0")}`;
    router.push(`/budget?month=${formatted}`);
  };

  // Navigasi bulan berikutnya
  const handleNextMonth = () => {
    let nextYear = year;
    let nextMonth = monthNum + 1;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }
    const formatted = `${nextYear}-${String(nextMonth).padStart(2, "0")}`;
    router.push(`/budget?month=${formatted}`);
  };

  // Ubah via input month
  const handleMonthChange = (newMonth: string) => {
    if (newMonth) {
      router.push(`/budget?month=${newMonth}`);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-[#070e20]/90 p-3 shadow-sm">
      {/* Tombol Navigasi Cepat & Label Bulan Terpilih */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrevMonth}
          title="Lihat bulan sebelumnya"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-[#091224] text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition shadow-2xs"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2 px-1">
          <span className="text-base sm:text-lg font-black tracking-tight text-white capitalize">
            {monthNameFormatted}
          </span>
          {isActualCurrentMonth && (
            <span className="rounded-md border border-emerald-500/30 bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-[#00df82]">
              Bulan Ini
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          title="Lihat bulan berikutnya"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-[#091224] text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition shadow-2xs"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Pilihan Langsung / Month Picker (FR-BUD-03) */}
      <div className="flex items-center gap-2">
        {!isActualCurrentMonth && (
          <button
            type="button"
            onClick={() => router.push(`/budget?month=${currentActualMonth}`)}
            className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-bold text-slate-200 hover:border-[#00df82] hover:text-[#00df82] transition"
          >
            Ke Bulan Ini
          </button>
        )}

        <div className="relative">
          <input
            type="month"
            value={currentMonth}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="rounded-xl border border-slate-800 bg-[#091224] px-3 py-1.5 text-xs font-bold text-slate-200 hover:border-slate-700 focus:border-[#00df82] focus:outline-none transition cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
