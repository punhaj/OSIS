"use client";

import * as React from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, CheckCircle2, Clock, Sparkles, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProgramRow } from "@/utils/supabase/client";

gsap.registerPlugin(ScrollTrigger);

export interface TimelineSectionProps {
  programs: ProgramRow[];
}

export function TimelineSection({ programs }: TimelineSectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const [selectedProgram, setSelectedProgram] = React.useState<ProgramRow | null>(
    null
  );

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      const items = listRef.current?.querySelectorAll(".timeline-item");
      if (!items || items.length === 0) return;

      gsap.fromTo(
        items,
        { opacity: 0, x: -28 },
        {
          opacity: 1,
          x: 0,
          duration: 0.75,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [programs]);

  const statusBadge = (status: ProgramRow["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            Selesai Terlaksana
          </span>
        );
      case "ongoing":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-300">
            <Clock className="size-3.5" />
            Sedang Berjalan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-xs font-medium text-sky-300">
            <Sparkles className="size-3.5" />
            Rencana (Coming Soon)
          </span>
        );
    }
  };

  return (
    <section
      id="proker"
      ref={sectionRef}
      className="border-b border-slate-800/80 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
            <Calendar className="size-3.5" />
            <span>Timeline & Roadmap</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Program Kerja OSIS SMAN 2 Pangkep
          </h2>
          <p className="max-w-2xl text-sm text-slate-400 sm:text-base">
            Klik pada program berstatus <strong>Selesai</strong> untuk membaca
            artikel laporan kegiatan, atau klik program <strong>Rencana</strong>{" "}
            untuk melihat rincian singkat.
          </p>
        </div>

        <div
          ref={listRef}
          className="relative border-l-2 border-slate-800 pl-6 space-y-8 ml-3"
        >
          {programs.map((program) => {
            const isCompleted = program.status === "completed";
            return (
              <div
                key={program.id}
                className="timeline-item relative rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-sky-500/40 hover:bg-slate-900/80"
              >
                <span className="absolute -left-[33px] top-7 flex size-4 items-center justify-center rounded-full border-2 border-sky-400 bg-slate-950" />

                <div className="flex flex-wrap items-center justify-between gap-2">
                  {statusBadge(program.status)}
                  {program.target_date && (
                    <span className="text-xs font-mono text-slate-400">
                      Target: {program.target_date}
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-lg font-bold text-white">
                  {program.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                  {program.description}
                </p>

                <div className="mt-4">
                  {isCompleted ? (
                    <Link
                      href="/berita/sukses-digelar-ldks-digital-sman-2-pangkep"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                    >
                      <span>Baca Laporan Kegiatan</span>
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProgram(program)}
                      className="border-slate-700 bg-slate-950 text-xs text-sky-300 hover:border-sky-500/50 hover:bg-sky-500/10"
                    >
                      Lihat Estimasi & Rencana
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Popup Coming Soon sesuai PRD Bagian 3.A.3 */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-sky-500/30 bg-slate-900 p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedProgram(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              aria-label="Tutup modal"
            >
              <X className="size-5" />
            </button>
            <div className="mb-3">{statusBadge(selectedProgram.status)}</div>
            <h3 className="text-xl font-bold text-white">
              {selectedProgram.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {selectedProgram.description}
            </p>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-400">
              <p>
                <strong>Estimasi Pelaksanaan:</strong>{" "}
                {selectedProgram.target_date ?? "Segera Diumumkan"}
              </p>
              <p className="mt-1">
                Program kerja ini sedang dalam tahap persiapan oleh panitia pelaksana
                OSIS SMAN 2 Pangkep.
              </p>
            </div>
            <div className="mt-5 flex justify-end">
              <Button
                type="button"
                onClick={() => setSelectedProgram(null)}
                className="bg-sky-500 text-slate-950 font-semibold hover:bg-sky-400"
              >
                Mengerti
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
