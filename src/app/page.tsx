import { HeroSection } from "@/components/sections/hero-section";
import { BoardSection } from "@/components/sections/board-section";
import { TimelineSection } from "@/components/sections/timeline-section";
import { AspirationForm } from "@/components/sections/aspiration-form";
import { createClient } from "@/utils/supabase/server";
import type { BoardMemberRow, ProgramRow } from "@/utils/supabase/client";

const FALLBACK_BOARD_MEMBERS: BoardMemberRow[] = [
  {
    id: "bm-1",
    name: "Muh. Rifky Pratama",
    position: "Ketua OSIS",
    division: "Pengurus Inti",
    image_url: "/globe.svg",
    instagram_url: "https://instagram.com",
    order_index: 1,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "bm-2",
    name: "Siti Aisyah Putri",
    position: "Wakil Ketua OSIS",
    division: "Pengurus Inti",
    image_url: "/globe.svg",
    instagram_url: "https://instagram.com",
    order_index: 2,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "bm-3",
    name: "Andi Naufal Dzaki",
    position: "Sekretaris Umum",
    division: "Pengurus Inti",
    image_url: "/globe.svg",
    instagram_url: "https://instagram.com",
    order_index: 3,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "bm-4",
    name: "Nurul Hidayah",
    position: "Koordinator Sekbid TIK",
    division: "Sekbid 9 - TIK & Digital",
    image_url: "/globe.svg",
    instagram_url: "https://instagram.com",
    order_index: 4,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

const FALLBACK_PROGRAMS: ProgramRow[] = [
  {
    id: "prog-1",
    title: "Latihan Dasar Kepemimpinan Siswa (LDKS) Digital",
    description:
      "Pembekalan kepemimpinan, manajemen organisasi modern, dan literasi digital bagi calon pengurus OSIS SMAN 2 Pangkep.",
    status: "completed",
    target_date: "2026-08-15",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-08-16T00:00:00Z",
  },
  {
    id: "prog-2",
    title: "SMADA Cup & Pekan Kreativitas Siswa 2026",
    description:
      "Kompetisi olahraga, e-sport, dan pameran karya seni antar-kelas serta SMA sederajat se-Kabupaten Pangkep.",
    status: "ongoing",
    target_date: "2026-10-30",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-10-20T00:00:00Z",
  },
  {
    id: "prog-3",
    title: "Festival Literasi & Inovasi Sains (FLIS)",
    description:
      "Workshop penulisan karya ilmiah, lomba debat bahasa Inggris, dan showcase robotik/coding siswa.",
    status: "planned",
    target_date: "2026-12-10",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-10-20T00:00:00Z",
  },
];

async function getLandingPageData(): Promise<{
  boardMembers: BoardMemberRow[];
  programs: ProgramRow[];
}> {
  const isPlaceholder =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  if (isPlaceholder) {
    return {
      boardMembers: FALLBACK_BOARD_MEMBERS,
      programs: FALLBACK_PROGRAMS,
    };
  }

  try {
    const supabase = await createClient();
    const [{ data: boardData }, { data: programData }] = await Promise.all([
      supabase
        .from("board_members")
        .select("*")
        .order("order_index", { ascending: true }),
      supabase
        .from("programs")
        .select("*")
        .order("target_date", { ascending: true }),
    ]);

    return {
      boardMembers:
        boardData && boardData.length > 0 ? boardData : FALLBACK_BOARD_MEMBERS,
      programs:
        programData && programData.length > 0 ? programData : FALLBACK_PROGRAMS,
    };
  } catch {
    return {
      boardMembers: FALLBACK_BOARD_MEMBERS,
      programs: FALLBACK_PROGRAMS,
    };
  }
}

export default async function Home() {
  const { boardMembers, programs } = await getLandingPageData();

  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-slate-100 pt-16">
      <HeroSection />
      <BoardSection members={boardMembers} />
      <TimelineSection programs={programs} />
      <AspirationForm />
    </main>
  );
}
