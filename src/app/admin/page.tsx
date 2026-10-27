import Link from "next/link";
import { CalendarCheck2, Newspaper, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
          <Sparkles className="size-3.5" />
          <span>Dashboard Pengurus OSIS</span>
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Pusat Kendali Konten & Program Kerja
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Kelola status pelaksanaan program kerja dan publikasi artikel kegiatan
          SMAN 2 Pangkep secara terpusat.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <div>
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-400">
              <CalendarCheck2 className="size-5" />
            </div>
            <h2 className="text-lg font-bold text-white">
              Manajemen Program Kerja (CRUD)
            </h2>
            <p className="mt-1.5 text-sm text-slate-400">
              Tambah, perbarui, hapus, dan ubah status program kerja (`planned`,
              `ongoing`, `completed`) yang tampil pada Timeline publik.
            </p>
          </div>
          <div className="mt-6">
            <Link href="/admin/programs">
              <Button className="bg-sky-500 text-slate-950 font-semibold hover:bg-sky-400">
                Kelola Program Kerja
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <div>
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
              <Newspaper className="size-5" />
            </div>
            <h2 className="text-lg font-bold text-white">
              Manajemen CMS Berita (Tiptap Editor)
            </h2>
            <p className="mt-1.5 text-sm text-slate-400">
              Tulis laporan kegiatan sekolah menggunakan Rich Text Editor Tiptap,
              hubungkan dengan program kerja, dan unggah gambar sampul.
            </p>
          </div>
          <div className="mt-6">
            <Link href="/admin/articles">
              <Button className="bg-sky-500 text-slate-950 font-semibold hover:bg-sky-400">
                Buka CMS Berita
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
