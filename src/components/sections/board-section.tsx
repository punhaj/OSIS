"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, ExternalLink } from "lucide-react";
import type { BoardMemberRow } from "@/utils/supabase/client";

gsap.registerPlugin(ScrollTrigger);

export interface BoardSectionProps {
  members: BoardMemberRow[];
}

export function BoardSection({ members }: BoardSectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const cardsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll(".board-card");
      if (!cards || cards.length === 0) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [members]);

  return (
    <section
      id="struktur"
      ref={sectionRef}
      className="border-b border-slate-800/80 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
            <Users className="size-3.5" />
            <span>Struktur Organisasi</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Pengurus Inti & Seksi Bidang OSIS
          </h2>
          <p className="max-w-2xl text-sm text-slate-400 sm:text-base">
            Sinergi pengurus OSIS SMAN 2 Pangkep dalam menghadirkan program kerja
            inovatif dan pelayanan terbaik bagi seluruh siswa.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {members.map((member) => (
            <article
              key={member.id}
              className="board-card group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/40 hover:bg-slate-900/90"
            >
              <div>
                <div className="mb-4 flex items-center gap-3.5">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-sky-500/30 bg-gradient-to-br from-sky-500/20 to-indigo-500/20 text-lg font-bold text-sky-300">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <span className="inline-block rounded-md bg-sky-500/10 px-2 py-0.5 text-[11px] font-medium text-sky-400">
                      {member.division}
                    </span>
                    <h3 className="mt-1 truncate text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                      {member.name}
                    </h3>
                    <p className="truncate text-xs text-slate-400">
                      {member.position}
                    </p>
                  </div>
                </div>
              </div>

              {member.instagram_url && (
                <div className="mt-3 border-t border-slate-800/80 pt-3">
                  <a
                    href={member.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    <span>Profil Instagram</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
