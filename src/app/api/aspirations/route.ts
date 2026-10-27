import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

const MAX_REQUESTS_PER_HOUR = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 jam dalam milidetik

// Penyimpanan sliding-window timestamp per alamat IP di memori server
const ipSubmissionLog = new Map<string, number[]>();

export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const cfIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp;

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "127.0.0.1";
}

export function checkIpRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
  recentTimestamps: number[];
} {
  const now = Date.now();
  const existing = ipSubmissionLog.get(ip) ?? [];
  const recent = existing.filter((timestamp) => now - timestamp < WINDOW_MS);

  if (recent.length > 0) {
    ipSubmissionLog.set(ip, recent);
  } else {
    ipSubmissionLog.delete(ip);
  }

  const remaining = Math.max(0, MAX_REQUESTS_PER_HOUR - recent.length);
  const oldestTimestamp = recent[0] ?? now;
  const resetInSeconds =
    recent.length >= MAX_REQUESTS_PER_HOUR
      ? Math.max(1, Math.ceil((oldestTimestamp + WINDOW_MS - now) / 1000))
      : 0;

  return {
    allowed: recent.length < MAX_REQUESTS_PER_HOUR,
    remaining,
    resetInSeconds,
    recentTimestamps: recent,
  };
}

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  const { remaining, resetInSeconds } = checkIpRateLimit(clientIp);

  return NextResponse.json(
    {
      limit: MAX_REQUESTS_PER_HOUR,
      remaining,
      resetInSeconds,
    },
    {
      status: 200,
      headers: {
        "X-RateLimit-Limit": String(MAX_REQUESTS_PER_HOUR),
        "X-RateLimit-Remaining": String(remaining),
      },
    }
  );
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateStatus = checkIpRateLimit(clientIp);

  if (!rateStatus.allowed) {
    return NextResponse.json(
      {
        error: `Batas pengiriman tercapai (maksimal ${MAX_REQUESTS_PER_HOUR} aspirasi per jam per IP). Silakan coba kembali dalam ${Math.ceil(
          rateStatus.resetInSeconds / 60
        )} menit.`,
        remaining: 0,
        resetInSeconds: rateStatus.resetInSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateStatus.resetInSeconds),
          "X-RateLimit-Limit": String(MAX_REQUESTS_PER_HOUR),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  let body: {
    sender_name?: string | null;
    message?: string;
    verified_human?: boolean;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Format payload JSON tidak valid." },
      { status: 400 }
    );
  }

  const trimmedMessage = (body.message ?? "").trim();
  const trimmedSender = (body.sender_name ?? "").trim() || null;

  if (!body.verified_human) {
    return NextResponse.json(
      { error: "Verifikasi keamanan anti-spam wajib dicentang." },
      { status: 400 }
    );
  }

  if (trimmedMessage.length < 10 || trimmedMessage.length > 1000) {
    return NextResponse.json(
      {
        error:
          "Pesan aspirasi harus berisi antara 10 hingga 1000 karakter.",
      },
      { status: 400 }
    );
  }

  const isPlaceholder =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  if (!isPlaceholder) {
    const supabase = await createClient();
    const { error } = await supabase.from("aspirations").insert({
      sender_name: trimmedSender,
      message: trimmedMessage,
      status: "pending",
    });

    if (error) {
      return NextResponse.json(
        { error: "Gagal menyimpan aspirasi ke database Supabase." },
        { status: 500 }
      );
    }
  }

  const updatedTimestamps = [...rateStatus.recentTimestamps, Date.now()];
  ipSubmissionLog.set(clientIp, updatedTimestamps);
  const newRemaining = Math.max(
    0,
    MAX_REQUESTS_PER_HOUR - updatedTimestamps.length
  );

  return NextResponse.json(
    {
      message:
        "Terima kasih! Aspirasi kamu telah tercatat secara aman dan akan ditinjau oleh pengurus OSIS.",
      remaining: newRemaining,
      limit: MAX_REQUESTS_PER_HOUR,
    },
    {
      status: 201,
      headers: {
        "X-RateLimit-Limit": String(MAX_REQUESTS_PER_HOUR),
        "X-RateLimit-Remaining": String(newRemaining),
      },
    }
  );
}
