import Link from "next/link";
import { Sparkles, Mail, MapPin, Heart } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Kolom 1: Profil OSIS */}
          <div className="flex flex-col gap-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg border border-sky-500/40 bg-sky-500/10 text-sky-400">
                <Sparkles className="size-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                OSIS SMAN 2 PANGKEP
              </span>
            </div>
            <p className="max-w-sm text-sm text-slate-400 leading-relaxed">
              Wadah aspirasi, inovasi, dan kepemimpinan siswa SMAN 2 Pangkep menuju
              generasi digital yang berkarakter, berprestasi, dan futuristik.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="size-3.5 text-sky-400 shrink-0" />
              <span>Kabupaten Pangkajene dan Kepulauan, Sulawesi Selatan</span>
            </div>
          </div>

          {/* Kolom 2: Tautan Navigasi */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Navigasi Cepat
            </h3>
            <ul className="flex flex-col gap-1.5 text-sm">
              <li>
                <Link href="/" className="hover:text-sky-300 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/#struktur" className="hover:text-sky-300 transition-colors">
                  Struktur Kepengurusan
                </Link>
              </li>
              <li>
                <Link href="/#proker" className="hover:text-sky-300 transition-colors">
                  Roadmap Program Kerja
                </Link>
              </li>
              <li>
                <Link href="/#berita" className="hover:text-sky-300 transition-colors">
                  Warta & Berita Kegiatan
                </Link>
              </li>
              <li>
                <Link href="/#aspirasi" className="hover:text-sky-300 transition-colors">
                  Kotak Suara Siswa
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Media Sosial & Kontak */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Terhubung
            </h3>
            <p className="text-xs text-slate-400">
              Ikuti dokumentasi kegiatan dan kabar terkini melalui kanal resmi kami.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram OSIS SMAN 2 Pangkep"
                className="flex size-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 transition-colors hover:border-pink-500/50 hover:bg-pink-500/10 hover:text-pink-400"
              >
                <InstagramIcon className="size-4.5" />
              </a>
              <a
                href="mailto:osis@sman2pangkep.sch.id"
                aria-label="Email OSIS SMAN 2 Pangkep"
                className="flex size-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 transition-colors hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-sky-400"
              >
                <Mail className="size-4.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Baris Bawah: Hak Cipta */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-800/60 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {currentYear} OSIS SMAN 2 Pangkep. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Dibuat dengan</span>
            <Heart className="size-3 text-red-500 fill-red-500 inline" />
            <span>oleh Tim IT & Media Kreatif OSIS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
