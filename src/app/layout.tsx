import * as React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DeviceCheckProvider } from "@/components/providers/device-check-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OSIS SMAN 2 Pangkep - Portal Digital & Sistem Informasi",
  description:
    "Portal Resmi OSIS SMAN 2 Pangkep: Informasi Kepengurusan, Roadmap Program Kerja, Warta Sekolah, dan Kotak Aspirasi Digital.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-sky-500/30 selection:text-sky-300">
        <DeviceCheckProvider>
          <Navbar />
          <div className="flex-1">
            <React.Suspense
              fallback={<div className="min-h-screen bg-slate-950" />}
            >
              {children}
            </React.Suspense>
          </div>
          <Footer />
        </DeviceCheckProvider>
      </body>
    </html>
  );
}
