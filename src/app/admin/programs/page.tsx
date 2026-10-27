"use client";

import * as React from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  createClient,
  type ProgramRow,
  type ProgramStatus,
} from "@/utils/supabase/client";

const INITIAL_PROGRAMS: ProgramRow[] = [
  {
    id: "prog-1",
    title: "Latihan Dasar Kepemimpinan Siswa (LDKS) Digital",
    description:
      "Pembekalan kepemimpinan, manajemen organisasi modern, dan literasi digital bagi pengurus OSIS.",
    status: "completed",
    target_date: "2026-08-15",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-08-16T00:00:00Z",
  },
  {
    id: "prog-2",
    title: "SMADA Cup & Pekan Kreativitas Siswa 2026",
    description:
      "Kompetisi olahraga, e-sport, dan pameran karya seni antar-kelas SMAN 2 Pangkep.",
    status: "ongoing",
    target_date: "2026-10-30",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-10-20T00:00:00Z",
  },
];

export default function AdminProgramsPage() {
  const [programs, setPrograms] = React.useState<ProgramRow[]>(INITIAL_PROGRAMS);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [status, setStatus] = React.useState<ProgramStatus>("planned");
  const [targetDate, setTargetDate] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);

  const isPlaceholder =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  const fetchPrograms = React.useCallback(async () => {
    if (isPlaceholder) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("programs")
      .select("*")
      .order("target_date", { ascending: true });
    if (data && data.length > 0) {
      setPrograms(data);
    }
  }, [isPlaceholder]);

  React.useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setStatus("planned");
    setTargetDate("");
  };

  const handleEdit = (program: ProgramRow) => {
    setEditingId(program.id);
    setTitle(program.title);
    setDescription(program.description);
    setStatus(program.status);
    setTargetDate(program.target_date ?? "");
    setStatusMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSaving(true);
    setStatusMessage(null);
    const nowIso = new Date().toISOString();

    try {
      const supabase = createClient();
      if (editingId) {
        if (!isPlaceholder) {
          await supabase
            .from("programs")
            .update({
              title: title.trim(),
              description: description.trim(),
              status,
              target_date: targetDate || null,
              updated_at: nowIso,
            })
            .eq("id", editingId);
        }
        setPrograms((prev) =>
          prev.map((p) =>
            p.id === editingId
              ? {
                  ...p,
                  title: title.trim(),
                  description: description.trim(),
                  status,
                  target_date: targetDate || null,
                  updated_at: nowIso,
                }
              : p
          )
        );
        setStatusMessage("Program kerja berhasil diperbarui.");
      } else {
        const newProgram: ProgramRow = {
          id: `prog-${Date.now()}`,
          title: title.trim(),
          description: description.trim(),
          status,
          target_date: targetDate || null,
          created_at: nowIso,
          updated_at: nowIso,
        };

        if (!isPlaceholder) {
          const { data } = await supabase
            .from("programs")
            .insert({
              title: newProgram.title,
              description: newProgram.description,
              status: newProgram.status,
              target_date: newProgram.target_date,
            })
            .select()
            .single();
          if (data) newProgram.id = data.id;
        }

        setPrograms((prev) => [newProgram, ...prev]);
        setStatusMessage("Program kerja baru berhasil ditambahkan.");
      }
      resetForm();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isPlaceholder) {
      const supabase = createClient();
      await supabase.from("programs").delete().eq("id", id);
    }
    setPrograms((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) resetForm();
    setStatusMessage("Program kerja telah dihapus.");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Manajemen Program Kerja (CRUD)
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Kelola daftar program kerja OSIS SMAN 2 Pangkep beserta status
          pelaksanaannya.
        </p>
      </div>

      {/* Form Tambah / Edit Proker */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">
            {editingId ? "Edit Program Kerja" : "Tambah Program Kerja Baru"}
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
              Batal Edit
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Judul Program Kerja *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: SMADA Cup & Pekan Kreativitas 2026"
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Status Proker *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProgramStatus)}
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
            >
              <option value="planned">Rencana (planned)</option>
              <option value="ongoing">Sedang Berjalan (ongoing)</option>
              <option value="completed">Selesai (completed)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Deskripsi Singkat *
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ringkasan tujuan dan bentuk kegiatan..."
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Target Tanggal
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {statusMessage && (
          <p className="text-xs font-medium text-sky-400">{statusMessage}</p>
        )}

        <Button
          type="submit"
          disabled={isSaving}
          className="bg-sky-500 text-slate-950 font-semibold hover:bg-sky-400"
        >
          <Plus className="mr-1.5 size-4" />
          {editingId ? "Simpan Perubahan" : "Tambah Program Kerja"}
        </Button>
      </form>

      {/* Daftar Tabel Program Kerja */}
      <div className="space-y-3">
        {programs.map((program) => (
          <div
            key={program.id}
            className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:flex-row sm:items-center"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-medium text-sky-300">
                  {program.status === "completed" ? (
                    <CheckCircle2 className="size-3 text-emerald-400" />
                  ) : program.status === "ongoing" ? (
                    <Clock className="size-3 text-amber-400" />
                  ) : (
                    <Sparkles className="size-3 text-sky-400" />
                  )}
                  {program.status}
                </span>
                {program.target_date && (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="size-3" />
                    {program.target_date}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white">{program.title}</h3>
              <p className="text-xs text-slate-400">{program.description}</p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleEdit(program)}
                className="border-slate-700 bg-slate-950 text-xs text-slate-200 hover:bg-slate-800"
              >
                <Pencil className="mr-1.5 size-3.5" />
                Edit
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDelete(program.id)}
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
