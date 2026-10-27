import * as React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarCheck2,
  Newspaper,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

const ADMIN_NAV_ITEMS = [
  {
    label: "Ringkasan Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Manajemen Proker",
    href: "/admin/programs",
    icon: CalendarCheck2,
  },
  {
    label: "CMS Berita (Tiptap)",
    href: "/admin/articles",
    icon: Newspaper,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 pt-16 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        {/* Sidebar Admin */}
        <aside className="w-full border-b border-slate-800/80 bg-slate-900/40 p-4 sm:p-6 lg:min-h-[calc(100vh-4rem)] lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3.5 py-2.5">
            <ShieldCheck className="size-5 text-sky-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-white">
                Panel Pengurus
              </p>
              <p className="truncate text-[11px] text-sky-300">
                OSIS SMAN 2 Pangkep
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/70 hover:text-sky-300"
                >
                  <Icon className="size-4 text-sky-400 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 border-t border-slate-800/80 pt-4">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-900 hover:text-white"
            >
              <ArrowLeft className="size-3.5" />
              <span>Kembali ke Portal Publik</span>
            </Link>
          </div>
        </aside>

        {/* Area Konten Utama Admin */}
        <main className="flex-1 p-4 sm:p-8">
          <React.Suspense
            fallback={
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-400">
                Memuat modul dashboard admin...
              </div>
            }
          >
            {children}
          </React.Suspense>
        </main>
      </div>
    </div>
  );
}
