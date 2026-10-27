# Product Requirement Document (PRD) - V2

## Proyek: Web Portal & Sistem Informasi OSIS SMA Futuristik (SMAN 2 PANGKEP)

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI, Supabase (Auth, DB, Storage), Vercel, GSAP & React Three Fiber (3D), Tiptap (Rich Text Editor), Cloudflare Turnstile / reCAPTCHA v3.

---

## 1. Tujuan Proyek (Product Objectives)

* **Digital Branding:** Menjadikan website OSIS sebagai etalase digital sekolah yang modern, interaktif, dan membanggakan melalui visual 3D scrollytelling.
* **Transparansi & Informasi:** Menyediakan informasi terpusat mengenai struktur kepengurusan, progres program kerja, dan berita kegiatan sekolah secara *real-time*.
* **Keterlibatan Siswa (Engagement):** Memfasilitasi suara siswa lewat kotak aspirasi anonim yang aman dari spam dan sistem interaksi program kerja.

---

## 2. Batasan Ruang Lingkup (Scope)

* **Frontend (Landing Page & Portal Berita):** Publik umum, guru, dan siswa. Bersifat read-only, interaktif 3D (dengan *fallback mode*), SEO-friendly, dan sangat responsif.
* **Backend Dashboard (Admin Panel):** Akses terbatas bagi pengurus OSIS/Admin dengan kredensial login untuk aktivitas CRUD dan moderasi.

---

## 3. Fitur Utama & Spesifikasi Fungsional

### A. Sisi Publik (Landing Page & Berita)

1. **Hero Section 3D Scrollytelling Futuristik**
   * Menampilkan elemen visual 3D ringan (misal: logo OSIS/kandidat futuristik) menggunakan React Three Fiber.
   * Animasi halus saat *scroll* menggunakan GSAP ScrollTrigger.
   * **[PENTING] Fallback Mode:** Sistem akan mendeteksi kemampuan perangkat (GPU/FPS). Jika diakses dari HP spesifikasi rendah, elemen 3D otomatis diganti dengan video ringan atau gambar statis futuristik untuk mencegah *lag* atau *overheating*.

2. **Profil & Struktur Kepengurusan**
   * Grid interaktif menampilkan foto, nama, jabatan, Seksi Bidang (Sekbid), dan tautan media sosial (Instagram) pengurus OSIS.

3. **Timeline & Roadmap Program Kerja (Proker)**
   * Menampilkan daftar proker berdasarkan status: *Selesai*, *Sedang Berjalan*, dan *Rencana (Coming Soon)*.
   * **Interaksi Klik Proker:**
     * Jika **Selesai**: Diarahkan ke halaman Berita/Artikel laporan kesuksesan kegiatan.
     * Jika **Belum Selesai/Rencana**: Membuka modal/popup "Coming Soon" (tanpa perlu halaman URL khusus) berisi ringkasan rencana dan estimasi waktu.

4. **Portal Berita & Artikel (SEO Optimized)**
   * Daftar berita kegiatan sekolah terbaru dengan fitur pencarian dan kategori.
   * **Optimasi Bagikan (Open Graph/SEO):** Setiap halaman artikel dilengkapi metadata Next.js agar *thumbnail*, judul, dan deskripsi muncul sempurna saat tautan dibagikan ke WhatsApp, Line, atau Instagram.

5. **Kotak Aspirasi & Suara Siswa (Aman dari Spam)**
   * Form pengiriman pesan/saran secara anonim atau identitas opsional.
   * **Anti-Spam (Rate Limiting):** Dilengkapi verifikasi Cloudflare Turnstile / reCAPTCHA v3 yang *invisible*, serta pembatasan *rate-limiting* (maksimal 3 pengiriman per IP/jam) untuk mencegah *spamming* ke database.

### B. Sisi Admin (Dashboard Pengurus OSIS)

1. **Autentikasi Aman**
   * Login menggunakan Supabase Auth (Email & Password) dengan Role-Based Access Control (Admin/Editor).

2. **Manajemen Program Kerja (Proker CRUD)**
   * Tambah, edit, hapus, dan ubah status proker (`planned`, `ongoing`, `completed`).

3. **Manajemen CMS Berita**
   * Menggunakan **Tiptap Editor** untuk penulisan artikel (menghasilkan HTML yang mudah di-render di frontend dengan Tailwind Typography).
   * Fitur unggah gambar *cover* otomatis ke Supabase Storage.

4. **Manajemen Struktur Organisasi**
   * Mengubah data pengurus, jabatan, foto, dan tautan sosial media.

5. **Moderasi Aspirasi Siswa**
   * Melihat daftar saran dari siswa, mengubah status penanganan (Belum Ditinjau / Selesai Ditindaklanjuti).

---

## 4. Arsitektur Database (Supabase PostgreSQL)

Tabel dirancang dengan mempertimbangkan keutuhan data dan jejak waktu (audit trail):

1. **`profiles` (Admin Users)**
   * `id` (UUID, PK, terkait dengan Supabase Auth)
   * `email` (Text)
   * `role` (`super_admin`, `editor`)
   * `created_at` (Timestamp)
   * `updated_at` (Timestamp)

2. **`board_members` (Struktur Organisasi)**
   * `id` (UUID, PK)
   * `name` (Text)
   * `position` (Text)
   * `division` (Text)
   * `image_url` (Text)
   * `instagram_url` (Text, Nullable)
   * `order_index` (Integer)

3. **`programs` (Program Kerja)**
   * `id` (UUID, PK)
   * `title` (Text)
   * `description` (Text)
   * `status` (`planned`, `ongoing`, `completed`)
   * `target_date` (Date)
   * `created_at` (Timestamp)
   * `updated_at` (Timestamp)
   * *(Catatan: Kolom `slug` dihapus karena proker hanya menggunakan Modal/Popup, bukan single page).*

4. **`articles` (Berita & Laporan Kegiatan)**
   * `id` (UUID, PK)
   * `program_id` (UUID, FK ke `programs`, opsional)
   * `author_id` (UUID, FK ke `profiles`) - *Untuk melacak siapa yang menulis.*
   * `title` (Text)
   * `slug` (Text, Unique)
   * `content` (HTML/Text dari Tiptap)
   * `cover_image` (Text)
   * `created_at` (Timestamp)
   * `updated_at` (Timestamp)

5. **`aspirations` (Kotak Saran)**
   * `id` (UUID, PK)
   * `sender_name` (Text, Nullable)
   * `message` (Text)
   * `status` (`pending`, `reviewed`, `resolved`)
   * `created_at` (Timestamp)
   * `updated_at` (Timestamp)

---

## 5. Rencana Tahapan Pengembangan (Milestones)

* **Fase 1: Inisialisasi & Setup Proyek**
  * Setup Next.js App Router, Tailwind CSS, Shadcn UI.
  * Konfigurasi Supabase, tabel database, RLS (Row Level Security), dan Storage.
* **Fase 2: Pengembangan Frontend (Performa & Visual)**
  * Membangun komponen UI utama.
  * Implementasi 3D (React Three Fiber) + GSAP beserta deteksi *fallback* untuk HP low-end.
* **Fase 3: Keamanan & Integrasi API**
  * Pemasangan Cloudflare Turnstile / reCAPTCHA pada form aspirasi.
  * Konfigurasi Open Graph dan Metadata Next.js untuk SEO berita.
* **Fase 4: Pengembangan Dashboard Admin**
  * Integrasi Supabase Auth.
  * Pembuatan form CRUD menggunakan Tiptap untuk CMS Berita.
* **Fase 5: Testing & Deployment**
  * Uji coba performa (Lighthouse) dan responsivitas di berbagai perangkat.
  * Deploy ke Vercel dan penyambungan *custom domain* sekolah.