# Dashboard PT. Global Inspeksi Forensik Teknik

Dashboard internal untuk jasa inspeksi & sertifikasi kontainer. Lihat
`docs/PT-GIS-DASHBOARD-PLAN.md` untuk blueprint lengkap.

## Stack

Next.js (App Router) + TypeScript, Drizzle ORM, MySQL, Tailwind CSS,
shadcn/ui, JWT + DB session auth.

## Setup

```bash
npm install
npm run db:generate   # generate Drizzle migrations
npm run db:migrate     # apply to MySQL
npm run seed            # seed initial admin user
npm run dev
```

## Keamanan

- **Hashing password** — `argon2` (`lib/db/queries/users.ts`), dipakai konsisten di login, pembuatan akun, reset password, dan ganti password sendiri. Tidak ada password plaintext yang disimpan.
- **Sesi login** — JWT (`jose`) disimpan di cookie `httpOnly`, `sameSite=lax`, `secure` saat production, plus catatan sesi di tabel `sessions` (`lib/auth/session.ts`) sehingga sesi bisa di-invalidate dari server.
- **Rate limiting login** — maksimal 5 percobaan gagal per kombinasi email+IP dalam 10 menit, lalu lockout 15 menit (`lib/auth/login-rate-limit.ts`).
- **Proteksi SQL injection** — semua query database lewat Drizzle ORM query builder (parameterized), tidak ada raw SQL yang menyisipkan input user secara langsung.
- **Validasi input** — semua form/server action divalidasi dengan Zod sebelum diproses (`app/actions/*.ts`).
- **RBAC (role-based access control)** — 4 role (`super_admin`, `admin`, `surveyor`, `finance`), dicek di server lewat `lib/auth/authz.ts` di setiap halaman & server action, bukan cuma disembunyikan di UI. Middleware (`proxy.ts`) ikut menahan route yang butuh sesi sebelum halaman dirender.
- **HTTP security headers** — `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security` (`next.config.ts`).
- **CSRF** — tercover bawaan oleh pengecekan origin pada Next.js Server Actions.
- **Ganti password mandiri** — wajib memasukkan password lama yang diverifikasi server sebelum password baru disimpan (`app/actions/account.ts`), plus konfirmasi pop-up sebelum diproses.
