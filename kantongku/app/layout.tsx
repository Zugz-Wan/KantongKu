import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Navbar } from "@/components/Navbar";
import { getCurrentUser } from "@/lib/session";
import "./globals.css";

export const metadata: Metadata = {
  title: "KantongKu - Manajemen Finansial Khusus Mahasiswa",
  description: "Atur Uang Sakumu, Bebas Khawatir di Akhir Bulan",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "dark";
  const user = await getCurrentUser().catch(() => null);

  return (
    <html lang="id" className={theme === "dark" ? "dark" : ""}>
      <body className="min-h-screen bg-[#040817] text-slate-100 antialiased flex flex-col font-sans selection:bg-[#00df82]/30 selection:text-[#00df82]">
        <Navbar userName={user?.name} />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
      </body>
    </html>
  );
}