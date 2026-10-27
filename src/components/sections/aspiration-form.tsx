"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MessageSquareHeart,
  Send,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const MAX_SUBMISSIONS_PER_HOUR = 3;

export function AspirationForm() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const [senderName, setSenderName] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [verifiedHuman, setVerifiedHuman] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [remainingQuota, setRemainingQuota] = React.useState(
    MAX_SUBMISSIONS_PER_HOUR
  );
  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchRateLimitQuota = React.useCallback(async () => {
    try {
      const response = await fetch("/api/aspirations", { method: "GET" });
      if (response.ok) {
        const data: { remaining?: number } = await response.json();
        if (typeof data.remaining === "number") {
          setRemainingQuota(data.remaining);
        }
      }
    } catch {
      // Abaikan jika gagal mengambil status kuota awal
    }
  }, []);

  React.useEffect(() => {
    fetchRateLimitQuota();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [fetchRateLimitQuota]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);

    const trimmedMsg = message.trim();
    if (trimmedMsg.length < 10) {
      setFeedback({
        type: "error",
        text: "Pesan aspirasi minimal terdiri dari 10 karakter.",
      });
      return;
    }

    if (!verifiedHuman) {
      setFeedback({
        type: "error",
        text: "Mohon centang verifikasi keamanan anti-spam terlebih dahulu.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/aspirations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_name: senderName.trim() || null,
          message: trimmedMsg,
          verified_human: verifiedHuman,
        }),
      });

      const result: {
        message?: string;
        error?: string;
        remaining?: number;
      } = await response.json();

      if (typeof result.remaining === "number") {
        setRemainingQuota(result.remaining);
      }

      if (!response.ok) {
        setFeedback({
          type: "error",
          text:
            result.error ??
            "Gagal mengirim aspirasi. Silakan periksa kuota pengiriman Anda.",
        });
        return;
      }

      setSenderName("");
      setMessage("");
      setVerifiedHuman(false);
      setFeedback({
        type: "success",
        text:
          result.message ??
          "Terima kasih! Aspirasi kamu telah tercatat dan akan ditinjau oleh pengurus OSIS.",
      });
    } catch {
      setFeedback({
        type: "error",
        text: "Gagal terhubung ke endpoint /api/aspirations.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="aspirasi" ref={sectionRef} className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div
          ref={cardRef}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 shadow-xl"
        >
          <div className="mb-8 flex flex-col gap-2">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
              <MessageSquareHeart className="size-3.5" />
              <span>Kotak Suara Siswa</span>
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Sampaikan Aspirasi & Saran Terbaikmu
            </h2>
            <p className="text-sm text-slate-400">
              Identitas bersifat opsional (anonim). Dilindungi Rate Limiting IP
              Server ({remainingQuota}/{MAX_SUBMISSIONS_PER_HOUR} kuota tersisa
              jam ini).
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="senderName"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Nama / Kelas (Opsional - Kosongkan jika Anonim)
              </label>
              <input
                id="senderName"
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Contoh: Andi - XI Merdeka 1 (atau biarkan kosong)"
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="aspirationMessage"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Pesan Aspirasi / Ide Kegiatan *
              </label>
              <textarea
                id="aspirationMessage"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan saran, kritik membangun, atau ide kegiatan untuk OSIS SMAN 2 Pangkep..."
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/90 px-4 py-3">
              <label className="flex cursor-pointer items-center gap-2.5 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={verifiedHuman}
                  onChange={(e) => setVerifiedHuman(e.target.checked)}
                  className="size-4 rounded border-slate-700 accent-sky-500"
                />
                <span>
                  Verifikasi Keamanan: Saya siswa/pengunjung manusia (Turnstile
                  Ready)
                </span>
              </label>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                <ShieldCheck className="size-3.5" />
                IP Rate Limiter (Max 3/Jam)
              </span>
            </div>

            {feedback && (
              <div
                className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-xs font-medium ${
                  feedback.type === "success"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-rose-500/30 bg-rose-500/10 text-rose-300"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="size-4 shrink-0" />
                ) : (
                  <AlertCircle className="size-4 shrink-0" />
                )}
                <span>{feedback.text}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || remainingQuota === 0}
              className="w-full sm:w-auto bg-sky-500 text-slate-950 font-semibold hover:bg-sky-400 px-6 py-2.5 disabled:opacity-50"
            >
              <Send className="mr-2 size-4" />
              {isSubmitting ? "Mengirim Aspirasi..." : "Kirim Aspirasi Sekarang"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
