import type { MetadataRoute } from "next";

const DEFAULT_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://osis-sman2pangkep.sch.id";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/berita/"],
        disallow: ["/admin/", "/api/", "/login"],
      },
    ],
    sitemap: `${DEFAULT_SITE_URL}/sitemap.xml`,
    host: DEFAULT_SITE_URL,
  };
}
