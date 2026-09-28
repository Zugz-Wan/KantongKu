"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * F-10 Cookies Preferensi:
 * Menyimpan preferensi pengguna (tema tampilan dan filter default) via cookies
 * yang diakses menggunakan next/headers.
 */
export async function toggleThemePreference(): Promise<void> {
  const cookieStore = await cookies();
  const currentTheme = cookieStore.get("theme")?.value || "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  cookieStore.set("theme", newTheme, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 tahun
    sameSite: "lax",
  });

  revalidatePath("/", "layout");
}

export async function setDefaultFilterPreference(filter: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("default_filter", filter, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 hari
    sameSite: "lax",
  });

  revalidatePath("/transactions");
}