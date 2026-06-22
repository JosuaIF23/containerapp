# Rencana Stack — Dashboard PT. Global Inspeksi Forensik Teknik

> Dokumen ini adalah blueprint/instruksi untuk membuat proyek **baru dan terpisah**
> (folder belum dibuat). Pindahkan file ini ke root folder proyek baru saat folder
> tersebut sudah diinisialisasi, agar bisa dijadikan acuan langkah demi langkah.

## 1. Ringkasan Proyek

- **Nama:** Dashboard internal PT. Global Inspeksi Forensik Teknik
- **Domain bisnis:** Jasa inspeksi & sertifikasi kontainer
- **Tujuan:** Sistem login + dashboard internal yang aman, dengan UI modern
  (frosted glass / glassmorphism), dan manajemen akses berbasis role yang
  fleksibel (role bisa dikelola, bukan hardcode).
- **4 Role default:**
  | Role | Tanggung jawab utama |
  |---|---|
  | **Super Admin** | Akses penuh sistem, kelola role & permission, kelola semua user |
  | **Admin** | Kelola data operasional harian, kelola user non-admin, tidak bisa ubah struktur role |
  | **Tim Surveyor** | Input & lihat data inspeksi kontainer, upload hasil temuan/laporan lapangan |
  | **Tim Finance** | Kelola invoice, biaya inspeksi, laporan keuangan |

## 2. Rekomendasi Tech Stack

| Layer | Pilihan | Alasan |
|---|---|---|
| Framework | **Next.js 16 (App Router)** + TypeScript + React 19 | Konsisten dengan ekosistem proyek `gift-lhu` yang sudah berjalan — tim sudah familiar, kurva belajar rendah |
| Database | **MySQL** | Konsisten dengan `gift-lhu`, dan bisa dikelola langsung lewat **phpMyAdmin** yang sudah familiar — banyak tersedia di hosting/cPanel |
| ORM | **Drizzle ORM** | Type-safe, ringan, query builder mirip SQL asli (mudah di-audit), sudah terbukti dipakai di `gift-lhu` |
| Tool kelola DB | **phpMyAdmin** | GUI web untuk lihat/edit tabel, jalankan query manual, export/import backup — tinggal aktifkan di hosting (cPanel) atau lewat XAMPP/Laragon untuk lokal |
| Autentikasi | **JWT custom + session tersimpan di DB** (pola sama seperti `gift-lhu`) | Sudah terbukti aman: rate limiting login, audit log, httpOnly cookie. Lebih fleksibel untuk RBAC dinamis dibanding library auth generik |
| Otorisasi (RBAC) | **Dinamis berbasis tabel `roles` + `permissions`** (bukan enum hardcode) | Memenuhi kebutuhan "manajemen role" — Super Admin bisa membuat/ubah role & permission lewat UI |
| Styling | **Tailwind CSS** + **shadcn/ui** + **Radix UI** primitives | Cepat membangun komponen accessible, mudah dikustom untuk efek glass |
| Animasi | **Framer Motion** | Transisi halus untuk login, sidebar, modal |
| Ikon | **Lucide React** | Konsisten dengan shadcn/ui |
| Validasi | **Zod** | Validasi form & input server action di semua boundary |
| Dark mode | **next-themes** | Dashboard modern wajib mendukung light/dark |
| Hashing password | **argon2** (atau bcrypt jika butuh kompatibilitas lebih luas) | argon2 lebih resisten terhadap brute-force GPU dibanding bcrypt |

## 3. Skema Database — RBAC Dinamis

Inti dari fitur "manajemen role" adalah role & permission disimpan di database,
bukan di-hardcode di kode, sehingga Super Admin bisa mengelolanya lewat UI.

```
roles
  id, name, description, is_system_role, created_at

permissions
  id, key (unique, e.g. "users.manage"), label, group

role_permissions
  role_id (FK roles), permission_id (FK permissions)

users
  id, name, email (unique), password_hash, role_id (FK roles),
  status (active/suspended), created_at

sessions
  id, user_id (FK users), token_hash, expires_at, created_at

login_attempts
  id, email, ip_address, success, created_at

audit_logs
  id, user_id, action, target_type, target_id, metadata (json), created_at
```

> Catatan: tipe `json` di atas adalah tipe kolom **JSON** bawaan MySQL (didukung
> sejak MySQL 5.7+, terlihat di phpMyAdmin sebagai kolom biasa berisi teks JSON).

**Contoh permission key per modul** (grouping untuk UI manajemen role):
- `users.manage`, `users.view`
- `roles.manage`
- `inspection.create`, `inspection.review`, `inspection.view`
- `finance.invoice.manage`, `finance.report.view`
- `audit.view`

**Seed default 4 role:**
- `super_admin` — semua permission, termasuk `roles.manage` dan `users.manage`
- `admin` — semua permission operasional kecuali `roles.manage`
- `surveyor` — `inspection.create`, `inspection.view`
- `finance` — `finance.invoice.manage`, `finance.report.view`

> Catatan keamanan: cek permission **selalu di server** (server action / route
> handler), jangan hanya menyembunyikan UI di client.

## 4. Struktur Folder Proyek

```
app/
  (auth)/login/                 → halaman login (split-screen + glass card)
  (app)/dashboard/               → dashboard, widget berbeda sesuai role
  (app)/roles/                   → manajemen role & permission (super_admin only)
  (app)/users/                   → manajemen user (super_admin, admin)
  (app)/account/                 → profil & ganti password
lib/
  auth/                          → session.ts, rbac.ts (assertPermission dinamis dari DB)
  db/
    schema.ts                    → drizzle schema
    queries/                     → data access layer per entitas
  validations/                   → zod schemas
components/
  ui/                            → shadcn components + variant "glass"
  dashboard/                     → kpi-card, sidebar, topbar (glass)
middleware.ts                    → proteksi route berdasarkan session + role
```

## 5. Checklist Keamanan

- [ ] Hash password dengan argon2 (atau bcrypt cost ≥ 12)
- [ ] Cookie session: `httpOnly`, `secure`, `sameSite=lax`
- [ ] Rate limiting + lockout pada percobaan login gagal
- [ ] Audit log untuk semua aksi sensitif (login, ubah role, hapus data, approve finance)
- [ ] Validasi input dengan Zod di setiap server boundary
- [ ] Permission check di server, bukan hanya sembunyikan tombol di UI
- [ ] Security headers di `next.config` (CSP, X-Frame-Options, X-Content-Type-Options)
- [ ] CSRF protection untuk form mutasi
- [ ] Least privilege: role baru default tanpa permission, harus di-assign manual

## 6. Panduan UI/UX — Modern & Frosted Glass

- **Palet warna:** Navy/teal sebagai warna utama (kesan profesional & trust),
  aksen emas/amber tipis untuk elemen sertifikasi/penting.
- **Efek glass:** reuse pola dari `gift-lhu` —
  `backdrop-blur-xl` + `bg-white/10` atau `bg-card/60` + `border border-white/20`
  + `shadow-glass` (custom shadow lembut).
- **Halaman login:** split-screen — sisi kiri ilustrasi/branding dengan gradient
  background, sisi kanan card glass berisi form login dengan animasi fade-in.
- **Dashboard:** sidebar glass collapsible, topbar glass dengan avatar & role badge,
  KPI card dengan efek glass di atas background gradient halus.
- **Dark mode:** toggle di topbar, gunakan `next-themes`, sesuaikan opacity glass
  agar tetap kontras di dark mode.

## 7. Deployment ke Hostinger

Proyek `gift-lhu` sudah terbukti berhasil dideploy ke Hostinger dengan cara di
bawah ini — proyek baru ini disusun agar bisa dideploy dengan pola **yang sama
persis**, supaya tim tidak perlu belajar cara baru.

### Kebutuhan paket Hostinger

- Minimal **Business Web Hosting** atau salah satu paket **Cloud Hosting**
  (yang punya fitur **Node.js Apps** di hPanel)
- Node.js versi **22.x** (atau 20.x — Next.js 16 butuh Node `>=20.9.0`)
- Alasan tidak bisa upload biasa ke `public_html`: proyek ini full Next.js
  (SSR, API route, middleware/auth, koneksi MySQL), jadi harus jalan sebagai
  proses Node.js, bukan file statis/PHP.

### Alur deploy (Git → Hostinger)

1. **Siapkan repo GitHub** — push project (jangan ikutkan `node_modules/`,
   `.next/`, `.env`, `public/uploads`)
2. **Buat website Node.js di hPanel** — `Websites` → `Add Website` →
   `Node.js Apps` → `Import Git Repository` → masukkan URL repo, pilih branch `main`
3. **Isi build settings**:
   - Node.js version: `22.x`
   - Build command: `npm run build`
   - Start command: `npm run start`
   - Output directory (jika diminta manual): `.next`
4. **Buat database MySQL** — di hPanel, masuk website yang dipakai →
   `Databases Management` → buat database + user, catat host/nama/username/password
5. **Isi environment variables** di dashboard Node.js app Hostinger:
   ```env
   DATABASE_URL=mysql://DB_USER:DB_PASSWORD@localhost:3306/DB_NAME
   AUTH_SECRET=ganti_dengan_random_string_panjang
   APP_URL=https://domain-anda.com
   COMPANY_NAME=PT. Global Inspeksi Forensik Teknik
   NODE_ENV=production
   ```
6. **Import struktur tabel via phpMyAdmin** — urutkan sesuai nomor file migrasi
   di folder `drizzle/` (hasil `drizzle-kit generate`). Catatan: `npm run build`
   hanya men-generate file migrasi lokal, **tidak otomatis** menerapkan ke DB
   production — file SQL tetap harus diimport manual lewat phpMyAdmin.
7. **Seed akun login awal** — jalankan `npm run seed` kalau ada akses command,
   atau import file SQL seed (4 akun: super_admin, admin, surveyor, finance)
   lewat phpMyAdmin
8. **Build & jalankan** di dashboard Hostinger, tunggu status sukses, lalu cek
   `/login` dan `/dashboard` di domain aplikasi

### Catatan penting

- Redeploy setelah push ke GitHub masih **manual** (klik rebuild di dashboard
  Hostinger) kecuali diatur auto-deploy
- Jangan edit source code langsung lewat Hostinger File Manager bila sudah
  pakai workflow Git
- Kalau ada upload file (misal foto inspeksi/lampiran), simpan dulu ke
  `public/uploads/...` seperti `gift-lhu` untuk MVP, tapi rencanakan pindah ke
  object storage untuk jangka panjang — backup folder ini sebelum redeploy besar
- Siapkan dokumen `docs/hostinger-deploy.md` di proyek baru (copy & sesuaikan
  dari `gift-lhu/docs/hostinger-deploy.md`) supaya tim punya panduan persis
  saat deploy pertama kali

## 8. Langkah Setup Awal (saat folder proyek sudah dibuat)

1. `npx create-next-app@latest` (TypeScript, App Router, Tailwind)
2. Install: `drizzle-orm mysql2 drizzle-kit zod argon2 framer-motion lucide-react next-themes jose`
   - Untuk DB lokal: install **XAMPP/Laragon** (sudah termasuk phpMyAdmin), buat database baru lewat phpMyAdmin, lalu isi connection string di `.env`
3. Setup shadcn/ui: `npx shadcn@latest init`, tambahkan komponen dasar (button, card, input, dialog, table, badge, avatar)
4. Buat `lib/db/schema.ts` sesuai skema di Bagian 3, jalankan `drizzle-kit generate` + migrate
5. Buat seed script untuk 4 role default + permission default + 1 user super_admin awal
6. Implementasi `lib/auth/session.ts` (JWT + session DB) dan `lib/auth/rbac.ts` (cek permission dinamis)
7. Buat halaman login dengan desain glass (Bagian 6)
8. Buat `middleware.ts` untuk proteksi route `(app)/*` berdasarkan session
9. Buat dashboard shell kosong per role + halaman manajemen role/user
