"use client";

import * as React from "react";
import {
  Send,
  Pencil,
  Trash2,
  Upload,
  FileText,
  Link2,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { createClient, type ArticleRow } from "@/utils/supabase/client";

function slugifyTitle(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const INITIAL_ARTICLES: ArticleRow[] = [
  {
    id: "art-1",
    program_id: "prog-1",
    author_id: null,
    title: "Sukses Digelar: LDKS Digital SMAN 2 Pangkep Cetak Pemimpin Muda",
    slug: "sukses-digelar-ldks-digital-sman-2-pangkep",
    content:
      "<p>Kegiatan <strong>LDKS Digital 2026</strong> telah terlaksana dengan antusiasme tinggi dari seluruh peserta pengurus baru OSIS SMAN 2 Pangkep.</p>",
    cover_image: "/globe.svg",
    created_at: "2026-08-16T08:00:00Z",
    updated_at: "2026-08-16T08:00:00Z",
  },
];

export default function AdminArticlesPage() {
  const [articles, setArticles] = React.useState<ArticleRow[]>(INITIAL_ARTICLES);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [programId, setProgramId] = React.useState("");
  const [coverImage, setCoverImage] = React.useState("");
  const [content, setContent] = React.useState(
    "<p>Tulis laporan atau berita kegiatan OSIS SMAN 2 Pangkep...</p>"
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);

  const isPlaceholder =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      setSlug(slugifyTitle(val));
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      if (!isPlaceholder) {
        const supabase = createClient();
        const filePath = `covers/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage
          .from("articles")
          .upload(filePath, file, { upsert: true });
        if (!error) {
          const { data } = supabase.storage
            .from("articles")
            .getPublicUrl(filePath);
          setCoverImage(data.publicUrl);
          setStatusMessage("Gambar cover berhasil diunggah ke Supabase Storage.");
          return;
        }
      }
      setCoverImage(`/uploads/${file.name}`);
      setStatusMessage("Gambar cover disiapkan (mode pratinjau lokal).");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setProgramId("");
    setCoverImage("");
    setContent("<p>Tulis laporan atau berita kegiatan OSIS SMAN 2 Pangkep...</p>");
  };

  const handleEdit = (article: ArticleRow) => {
    setEditingId(article.id);
    setTitle(article.title);
    setSlug(article.slug);
    setProgramId(article.program_id ?? "");
    setCoverImage(article.cover_image ?? "");
    setContent(article.content);
    setStatusMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    setIsSubmitting(true);
    setStatusMessage(null);
    const nowIso = new Date().toISOString();

    try {
      const supabase = createClient();
      let authorId: string | null = null;

      if (!isPlaceholder) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        authorId = user?.id ?? null;
      }

      if (editingId) {
        if (!isPlaceholder) {
          await supabase
            .from("articles")
            .update({
              title: title.trim(),
              slug: slug.trim(),
              program_id: programId.trim() || null,
              cover_image: coverImage.trim() || null,
              content,
              updated_at: nowIso,
            })
            .eq("id", editingId);
        }
        setArticles((prev) =>
          prev.map((a) =>
            a.id === editingId
              ? {
                  ...a,
                  title: title.trim(),
                  slug: slug.trim(),
                  program_id: programId.trim() || null,
                  cover_image: coverImage.trim() || null,
                  content,
                  updated_at: nowIso,
                }
              : a
          )
        );
        setStatusMessage("Artikel berita berhasil diperbarui.");
      } else {
        const newArticle: ArticleRow = {
          id: `art-${Date.now()}`,
          program_id: programId.trim() || null,
          author_id: authorId,
          title: title.trim(),
          slug: slug.trim(),
          content,
          cover_image: coverImage.trim() || "/globe.svg",
          created_at: nowIso,
          updated_at: nowIso,
        };

        if (!isPlaceholder) {
          const { data } = await supabase
            .from("articles")
            .insert({
              program_id: newArticle.program_id,
              author_id: newArticle.author_id,
              title: newArticle.title,
              slug: newArticle.slug,
              content: newArticle.content,
              cover_image: newArticle.cover_image,
            })
            .select()
            .single();
          if (data) newArticle.id = data.id;
        }

        setArticles((prev) => [newArticle, ...prev]);
        setStatusMessage("Artikel berita baru berhasil dipublikasikan.");
      }
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isPlaceholder) {
      const supabase = createClient();
      await supabase.from("articles").delete().eq("id", id);
    }
    setArticles((prev) => prev.filter((a) => a.id !== id));
    if (editingId === id) resetForm();
    setStatusMessage("Artikel berita telah dihapus.");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Manajemen CMS Berita (Tiptap Editor)
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Tulis, sunting, dan publikasikan artikel kegiatan OSIS SMAN 2 Pangkep.
        </p>
      </div>

      {/* Form CMS Artikel */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">
            {editingId ? "Sunting Artikel Berita" : "Tulis Artikel Berita Baru"}
          </h2>
          {editingId && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetForm}
              className="border-slate-700 bg-slate-950 text-xs text-slate-300"
            >
              <RotateCcw className="mr-1.5 size-3.5" />
              Batal Sunting
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Judul Artikel *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Contoh: Sukses Digelar: SMADA Cup 2026"
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Slug URL (SEO) *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(slugifyTitle(e.target.value))}
              placeholder="sukses-digelar-smada-cup-2026"
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 font-mono text-sm text-sky-300 focus:border-sky-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              ID Program Kerja Terkait (Opsional)
            </label>
            <input
              type="text"
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              placeholder="Contoh: prog-1 (atau kosongkan)"
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Cover Image (URL / Unggah ke Supabase Storage)
            </label>
            <div className="mt-1.5 flex items-center gap-2">
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://... atau unggah file"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
              />
              <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-medium text-sky-300 hover:bg-slate-800">
                <Upload className="size-3.5" />
                <span>{isUploading ? "..." : "Upload"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Konten Artikel (Rich Text Tiptap) *
          </label>
          <TiptapEditor initialContent={content} onUpdate={setContent} />
        </div>

        {statusMessage && (
          <p className="text-xs font-medium text-sky-400">{statusMessage}</p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-sky-500 text-slate-950 font-semibold hover:bg-sky-400"
        >
          <Send className="mr-1.5 size-4" />
          {editingId ? "Perbarui Artikel" : "Publikasikan Artikel"}
        </Button>
      </form>

      {/* Daftar Artikel Terpublikasi */}
      <div className="space-y-3">
        {articles.map((article) => (
          <div
            key={article.id}
            className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:flex-row sm:items-center"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1 font-mono text-sky-400">
                  <Link2 className="size-3.5" />/{article.slug}
                </span>
                {article.program_id && (
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
                    Proker: {article.program_id}
                  </span>
                )}
              </div>
              <h3 className="flex items-center gap-2 text-base font-bold text-white">
                <FileText className="size-4 text-sky-400 shrink-0" />
                {article.title}
              </h3>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleEdit(article)}
                className="border-slate-700 bg-slate-950 text-xs text-slate-200 hover:bg-slate-800"
              >
                <Pencil className="mr-1.5 size-3.5" />
                Sunting
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDelete(article.id)}
                className="border-rose-500/30 bg-rose-500/10 text-xs text-rose-300 hover:bg-rose-500/20"
              >
                <Trash2 className="mr-1.5 size-3.5" />
                Hapus
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
