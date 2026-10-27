import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

export type UserRole = "super_admin" | "editor";
export type ProgramStatus = "planned" | "ongoing" | "completed";
export type AspirationStatus = "pending" | "reviewed" | "resolved";

export type ProfileRow = {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type BoardMemberRow = {
  id: string;
  name: string;
  position: string;
  division: string;
  image_url: string;
  instagram_url: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type ProgramRow = {
  id: string;
  title: string;
  description: string;
  status: ProgramStatus;
  target_date: string | null;
  created_at: string;
  updated_at: string;
};

export type ArticleRow = {
  id: string;
  program_id: string | null;
  author_id: string | null;
  title: string;
  slug: string;
  content: string;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
};

export type AspirationRow = {
  id: string;
  sender_name: string | null;
  message: string;
  status: AspirationStatus;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, "created_at" | "updated_at">;
        Update: Partial<Omit<ProfileRow, "id" | "created_at">>;
        Relationships: [];
      };
      board_members: {
        Row: BoardMemberRow;
        Insert: Omit<BoardMemberRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<BoardMemberRow, "id" | "created_at">>;
        Relationships: [];
      };
      programs: {
        Row: ProgramRow;
        Insert: Omit<ProgramRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ProgramRow, "id" | "created_at">>;
        Relationships: [];
      };
      articles: {
        Row: ArticleRow;
        Insert: Omit<ArticleRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ArticleRow, "id" | "created_at">>;
        Relationships: [];
      };
      aspirations: {
        Row: AspirationRow;
        Insert: {
          sender_name?: string | null;
          message: string;
          status?: AspirationStatus;
        };
        Update: Partial<Omit<AspirationRow, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export function createClient(): SupabaseClient<Database> {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
