-- ============================================================================
-- Skema Database PostgreSQL (Supabase) - Web Portal OSIS SMAN 2 Pangkep
-- Mencakup tabel: profiles, board_members, programs, articles, aspirations
-- Dilengkapi otomatisasi updated_at dan kebijakan Row Level Security (RLS)
-- ============================================================================

-- Ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Fungsi Trigger untuk memperbarui kolom updated_at secara otomatis
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- 1. Tabel: profiles (Admin Users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'editor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger otomatis membuat profil saat user baru mendaftar di Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'editor')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 2. Tabel: board_members (Struktur Organisasi OSIS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.board_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  division TEXT NOT NULL,
  image_url TEXT NOT NULL,
  instagram_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_board_members_updated_at ON public.board_members;
CREATE TRIGGER set_board_members_updated_at
  BEFORE UPDATE ON public.board_members
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 3. Tabel: programs (Program Kerja OSIS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'ongoing', 'completed')),
  target_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_programs_updated_at ON public.programs;
CREATE TRIGGER set_programs_updated_at
  BEFORE UPDATE ON public.programs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 4. Tabel: articles (Berita & Laporan Kegiatan)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  cover_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_program_id ON public.articles(program_id);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);

DROP TRIGGER IF EXISTS set_articles_updated_at ON public.articles;
CREATE TRIGGER set_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 5. Tabel: aspirations (Kotak Saran & Aspirasi Siswa)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.aspirations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_aspirations_updated_at ON public.aspirations;
CREATE TRIGGER set_aspirations_updated_at
  BEFORE UPDATE ON public.aspirations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 6. Row Level Security (RLS) & Kebijakan Akses Dasar
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aspirations ENABLE ROW LEVEL SECURITY;

-- Fungsi helper untuk memeriksa apakah pengguna yang login adalah Admin/Editor
CREATE OR REPLACE FUNCTION public.is_osis_staff()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('super_admin', 'editor')
  );
$$;

-- A. Policies untuk tabel `profiles` (Hanya Admin/Staff & Pemilik Akun)
DROP POLICY IF EXISTS "Profil dapat dibaca publik" ON public.profiles;
DROP POLICY IF EXISTS "Profil hanya dibaca pemilik atau admin" ON public.profiles;
CREATE POLICY "Profil hanya dibaca pemilik atau admin"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_osis_staff());

DROP POLICY IF EXISTS "Pengguna dapat memperbarui profil sendiri" ON public.profiles;
DROP POLICY IF EXISTS "Admin memiliki akses penuh CRUD profiles" ON public.profiles;
CREATE POLICY "Admin memiliki akses penuh CRUD profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_osis_staff())
  WITH CHECK (public.is_osis_staff());

-- B. Policies untuk tabel `board_members` (Publik: READ, Admin: Full CRUD)
DROP POLICY IF EXISTS "Struktur pengurus dapat dibaca publik" ON public.board_members;
CREATE POLICY "Struktur pengurus dapat dibaca publik"
  ON public.board_members FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Pengurus OSIS dapat mengelola board_members" ON public.board_members;
CREATE POLICY "Pengurus OSIS dapat mengelola board_members"
  ON public.board_members FOR ALL
  TO authenticated
  USING (public.is_osis_staff())
  WITH CHECK (public.is_osis_staff());

-- C. Policies untuk tabel `programs` (Publik: READ, Admin: Full CRUD)
DROP POLICY IF EXISTS "Program kerja dapat dibaca publik" ON public.programs;
CREATE POLICY "Program kerja dapat dibaca publik"
  ON public.programs FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Pengurus OSIS dapat mengelola programs" ON public.programs;
CREATE POLICY "Pengurus OSIS dapat mengelola programs"
  ON public.programs FOR ALL
  TO authenticated
  USING (public.is_osis_staff())
  WITH CHECK (public.is_osis_staff());

-- D. Policies untuk tabel `articles` (Publik: READ, Admin: Full CRUD)
DROP POLICY IF EXISTS "Berita dan artikel dapat dibaca publik" ON public.articles;
CREATE POLICY "Berita dan artikel dapat dibaca publik"
  ON public.articles FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Pengurus OSIS dapat mengelola articles" ON public.articles;
CREATE POLICY "Pengurus OSIS dapat mengelola articles"
  ON public.articles FOR ALL
  TO authenticated
  USING (public.is_osis_staff())
  WITH CHECK (public.is_osis_staff());

-- E. Policies untuk tabel `aspirations` (Publik: HANYA INSERT Anonim, Admin: Full CRUD)
DROP POLICY IF EXISTS "Siswa/publik dapat mengirim aspirasi baru" ON public.aspirations;
CREATE POLICY "Siswa/publik dapat mengirim aspirasi baru"
  ON public.aspirations FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND char_length(trim(message)) >= 10
    AND char_length(trim(message)) <= 1000
  );

DROP POLICY IF EXISTS "Pengurus OSIS dapat membaca dan memoderasi aspirations" ON public.aspirations;
CREATE POLICY "Pengurus OSIS dapat membaca dan memoderasi aspirations"
  ON public.aspirations FOR ALL
  TO authenticated
  USING (public.is_osis_staff())
  WITH CHECK (public.is_osis_staff());
