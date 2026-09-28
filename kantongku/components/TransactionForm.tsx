import Link from "next/link";
import { createTransaction } from "@/app/actions/transaction";

export function TransactionForm() {
  const today = new Date().toISOString().split("T")[0];

  return (
    <form action={createTransaction} className="space-y-6">
      {/* Jenis Transaksi */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          Jenis Transaksi <span className="text-rose-400">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="group relative flex cursor-pointer items-center justify-center gap-2.5 rounded-2xl border-2 border-slate-800 bg-[#091224] p-4 text-center transition-all has-[:checked]:border-[#00df82] has-[:checked]:bg-emerald-950/40 has-[:checked]:text-[#00df82] hover:border-emerald-500/50">
            <input
              type="radio"
              name="type"
              value="income"
              className="sr-only"
              required
            />
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-950 text-[#00df82] text-base border border-emerald-500/20">
              💰
            </span>
            <div className="text-left">
              <p className="text-sm font-bold">Pemasukan</p>
              <p className="text-[11px] text-slate-400">Gaji, kiriman ortu, hadiah</p>
            </div>
          </label>

          <label className="group relative flex cursor-pointer items-center justify-center gap-2.5 rounded-2xl border-2 border-slate-800 bg-[#091224] p-4 text-center transition-all has-[:checked]:border-rose-500 has-[:checked]:bg-rose-950/40 has-[:checked]:text-rose-400 hover:border-rose-500/50">
            <input
              type="radio"
              name="type"
              value="expense"
              className="sr-only"
              defaultChecked
              required
            />
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-950 text-rose-400 text-base border border-rose-500/20">
              💸
            </span>
            <div className="text-left">
              <p className="text-sm font-bold">Pengeluaran</p>
              <p className="text-[11px] text-slate-400">Makan, kost, bensin, dll</p>
            </div>
          </label>
        </div>
      </div>

      {/* Nominal */}
      <div>
        <label htmlFor="amount" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Nominal Transaksi <span className="text-rose-400">*</span>
        </label>
        <div className="relative rounded-2xl shadow-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <span className="text-base font-bold text-slate-500">Rp</span>
          </div>
          <input
            type="number"
            id="amount"
            name="amount"
            min="1"
            step="any"
            placeholder="0"
            required
            className="block w-full rounded-2xl border border-slate-800 bg-[#091224] py-3.5 pl-12 pr-4 text-xl font-bold tracking-tight text-white placeholder-slate-500 focus:border-[#00df82] focus:outline-none focus:ring-4 focus:ring-[#00df82]/15 transition"
          />
        </div>
      </div>

      {/* Kategori & Tanggal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Kategori */}
        <div>
          <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Kategori <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              required
              defaultValue="Makanan & Minuman"
              className="block w-full rounded-xl border border-slate-800 bg-[#091224] py-3 px-3.5 text-sm font-medium text-white focus:border-[#00df82] focus:outline-none focus:ring-4 focus:ring-[#00df82]/15 transition appearance-none cursor-pointer"
            >
              <option value="Makanan & Minuman">🍔 Makanan & Minuman</option>
              <option value="Transportasi">🛵 Transportasi</option>
              <option value="Uang Saku">💵 Uang Saku</option>
              <option value="Gaji / Upah">💼 Gaji / Upah</option>
              <option value="Pendidikan / Kuliah">📚 Pendidikan / Kuliah</option>
              <option value="Belanja Pribadi">🛍️ Belanja Pribadi</option>
              <option value="Hiburan">🎮 Hiburan</option>
              <option value="Tagihan / Kost">🏠 Tagihan / Kost</option>
              <option value="Kesehatan">💊 Kesehatan</option>
              <option value="Lainnya">📦 Lainnya</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tanggal */}
        <div>
          <label htmlFor="date" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Tanggal <span className="text-rose-400">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            defaultValue={today}
            required
            className="block w-full rounded-xl border border-slate-800 bg-[#091224] py-3 px-3.5 text-sm font-medium text-white focus:border-[#00df82] focus:outline-none focus:ring-4 focus:ring-[#00df82]/15 transition cursor-pointer"
          />
        </div>
      </div>

      {/* Keterangan */}
      <div>
        <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Keterangan / Catatan <span className="text-slate-500 font-normal lowercase">(opsional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Catatan tambahan (misal: Nasi Padang ayam bakar, Bensin motor, dll.)"
          className="block w-full rounded-xl border border-slate-800 bg-[#091224] p-3.5 text-sm text-white placeholder-slate-500 focus:border-[#00df82] focus:outline-none focus:ring-4 focus:ring-[#00df82]/15 transition resize-none"
        />
      </div>

      {/* Tombol Aksi */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
        <Link
          href="/transactions"
          className="rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition"
        >
          Batal
        </Link>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-[#00df82] px-6 py-2.5 text-sm font-black text-slate-950 shadow-md shadow-[#00df82]/20 hover:bg-[#05f196] focus:outline-none focus:ring-4 focus:ring-[#00df82]/25 transition active:scale-98"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>Simpan Transaksi</span>
        </button>
      </div>
    </form>
  );
}