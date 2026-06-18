# Dashboard PT Global Inspeksi Sertifikasi

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
