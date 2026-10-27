import type { MetadataRoute } from "next";
import { createClient } from "@/utils/supabase/server";

const DEFAULT_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://osis-sman2pangkep.sch.id";

const FALLBACK_ARTICLE_SLUGS = [
  {
    slug: "sukses-digelar-ldks-digital-sman-2-pangkep",
    updated_at: "2026-08-16T08:00:00Z",
  },
  {
    slug: "smada-cup-pekan-kreativitas-siswa-2026",
    updated_at: "2026-10-20T08:00:00Z",
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: DEFAULT_SITE_URL,
      lastModified: new Date("2026-10-26T00:00:00Z"),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  const isPlaceholder =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  let articles = FALLBACK_ARTICLE_SLUGS;

  if (!isPlaceholder) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("articles")
        .select("slug, updated_at")
        .order("updated_at", { ascending: false });

      if (data && data.length > 0) {
        articles = data;
      }
    } catch {
      // Gunakan daftar artikel fallback jika terjadi kendala jaringan
    }
  }

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${DEFAULT_SITE_URL}/berita/${article.slug}`,
    lastModified: new Date(article.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...articleRoutes];
}
