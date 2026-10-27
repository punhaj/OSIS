import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Sparkles, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import type { ArticleRow } from "@/utils/supabase/client";

const DEFAULT_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://osis-sman2pangkep.sch.id";

const FALLBACK_ARTICLES: Record<string, ArticleRow> = {
  "sukses-digelar-ldks-digital-sman-2-pangkep": {
    id: "art-1",
    program_id: "prog-1",
    author_id: null,
    title: "Sukses Digelar: LDKS Digital SMAN 2 Pangkep Cetak Pemimpin Muda",
    slug: "sukses-digelar-ldks-digital-sman-2-pangkep",
    content:
      "<p>Kegiatan <strong>Latihan Dasar Kepemimpinan Siswa (LDKS) Digital 2026</strong> telah sukses diselenggarakan oleh OSIS SMAN 2 Pangkep dengan diikuti oleh seluruh calon pengurus baru.</p><h2>Fokus Transformasi Digital & Karakter</h2><p>Melalui kegiatan ini, peserta dibekali keterampilan manajemen program kerja modern, komunikasi publik, serta pemanfaatan teknologi informasi untuk transparansi organisasi siswa.</p>",
    cover_image: "/globe.svg",
    created_at: "2026-08-16T08:00:00Z",
    updated_at: "2026-08-16T10:30:00Z",
  },
  "smada-cup-pekan-kreativitas-siswa-2026": {
    id: "art-2",
    program_id: "prog-2",
    author_id: null,
    title: "SMADA Cup & Pekan Kreativitas Siswa 2026 Resmi Dibuka",
    slug: "smada-cup-pekan-kreativitas-siswa-2026",
    content:
      "<p>Ajang tahunan <strong>SMADA Cup 2026</strong> resmi dibuka di SMAN 2 Pangkep dengan mempertandingkan cabang olahraga, e-sport, dan pameran inovasi seni antar-kelas.</p>",
    cover_image: "/globe.svg",
    created_at: "2026-10-20T08:00:00Z",
    updated_at: "2026-10-20T09:00:00Z",
  },
};

export function stripHtmlToExcerpt(html: string, maxLength = 155): string {
  const plain = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength - 3).trim()}...`;
}

export async function getArticleBySlug(
  slug: string
): Promise<ArticleRow | null> {
  const isPlaceholder =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  if (!isPlaceholder) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .single();

      if (data) return data;
    } catch {
      // Gunakan fallback artikel jika belum ditemukan di database
    }
  }

  return FALLBACK_ARTICLES[slug] ?? null;
}

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return Object.keys(FALLBACK_ARTICLES).map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: ArticlePageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Berita Tidak Ditemukan | OSIS SMAN 2 Pangkep",
      description: "Halaman artikel berita yang Anda cari tidak ditemukan.",
    };
  }

  const excerpt = stripHtmlToExcerpt(article.content);
  const articleUrl = `${DEFAULT_SITE_URL}/berita/${article.slug}`;
  const ogImageUrl = article.cover_image
    ? article.cover_image.startsWith("http")
      ? article.cover_image
      : `${DEFAULT_SITE_URL}${article.cover_image}`
    : `${DEFAULT_SITE_URL}/globe.svg`;

  const previousImages = (await parent).openGraph?.images ?? [];

  return {
    title: `${article.title} | Warta OSIS SMAN 2 Pangkep`,
    description: excerpt,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: article.title,
      description: excerpt,
      url: articleUrl,
      siteName: "Portal Digital OSIS SMAN 2 Pangkep",
      locale: "id_ID",
      type: "article",
      publishedTime: article.created_at,
      modifiedTime: article.updated_at,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: excerpt,
      images: [ogImageUrl],
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const formattedDate = new Date(article.created_at).toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <main className="min-h-screen bg-slate-950 pt-24 pb-20 text-slate-100">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/#proker"
            className="inline-flex items-center gap-2 text-xs font-medium text-sky-400 hover:text-sky-300"
          >
            <ArrowLeft className="size-3.5" />
            <span>Kembali ke Beranda & Roadmap Proker</span>
          </Link>
        </div>

        <header className="space-y-4 border-b border-slate-800 pb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 font-semibold text-sky-300">
              <Sparkles className="size-3.5" />
              Laporan Kegiatan OSIS
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5 text-sky-400" />
              {formattedDate}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            {article.title}
          </h1>
        </header>

        {article.cover_image && (
          <div className="relative my-8 flex h-64 sm:h-80 w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
            <Image
              src={article.cover_image}
              alt={article.title}
              width={120}
              height={120}
              className="opacity-85 invert"
              priority
            />
          </div>
        )}

        <div
          className="prose prose-invert max-w-none space-y-4 text-slate-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Bagikan Berita Ini (Open Graph Ready)
            </p>
            <p className="text-xs text-slate-400">
              Tautan halaman ini telah dioptimalkan untuk pratinjau WhatsApp,
              Line, dan Instagram.
            </p>
          </div>
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700 bg-slate-950 text-xs text-slate-200 hover:border-sky-500/50 hover:text-sky-300"
            >
              <Share2 className="mr-1.5 size-3.5 text-sky-400" />
              Beranda OSIS
            </Button>
          </Link>
        </footer>
      </article>
    </main>
  );
}
