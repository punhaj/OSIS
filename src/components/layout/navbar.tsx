"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Menu, X, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Struktur OSIS", href: "/#struktur" },
    { label: "Program Kerja", href: "/#proker" },
    { label: "Berita", href: "/#berita" },
    { label: "Kotak Aspirasi", href: "/#aspirasi" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md shadow-lg shadow-black/20 py-3"
          : "bg-transparent py-5 border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo / Brand */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl border border-sky-500/40 bg-sky-500/10 text-sky-400 transition-all duration-300 group-hover:scale-105 group-hover:border-sky-400 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.3)]">
            <Sparkles className="size-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
              OSIS SMAN 2
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-widest text-sky-400">
              PANGKEP
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-slate-800/60 bg-slate-900/40 px-4 py-1.5 backdrop-blur-sm">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-3.5 py-1 text-sm font-medium text-slate-300 transition-colors hover:text-sky-300 hover:bg-slate-800/50"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-800 bg-slate-900/60 text-slate-200 hover:border-sky-500/40 hover:bg-sky-500/10 hover:text-sky-300"
            >
              <Shield className="mr-1.5 size-3.5 text-sky-400" />
              Portal Admin
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none"
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">Buka menu navigasi</span>
            {mobileMenuOpen ? (
              <X className="size-6 text-slate-200" />
            ) : (
              <Menu className="size-6 text-slate-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-sky-300"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-slate-800/80">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-lg bg-sky-500/10 border border-sky-500/30 px-3 py-2.5 text-sm font-semibold text-sky-300 hover:bg-sky-500/20"
              >
                <span className="flex items-center gap-2">
                  <Shield className="size-4" />
                  Masuk Portal Admin
                </span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
