# TellittoRosett

Maternal-care clinic web app: public site, patient booking and dashboard, and a staff portal.
Built with Next.js 14 (App Router), NextAuth (credentials), MongoDB/Mongoose and Tailwind CSS.

## Setup

```bash
npm install
cp .env.example .env   # then fill in MONGODB_URI and NEXTAUTH_SECRET
npm run dev
```

Generate a secret: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

## Scripts

| Command             | Purpose                      |
| ------------------- | ---------------------------- |
| `npm run dev`       | Dev server                   |
| `npm run build`     | Production build             |
| `npm run lint`      | ESLint                       |
| `npm run typecheck` | TypeScript, no emit          |
| `npm test`          | Unit tests (Vitest)          |
| `npm run format`    | Prettier                     |

## Security model

- **Roles:** `patient` and `staff`. Public registration always creates a patient.
  Staff accounts must be provisioned by an admin (directly in the database or a future admin tool).
- **API authorization** (see `src/lib/api.ts`):
  - Public: `GET /api/services`, `GET /api/staff` (no contact details), `GET /api/articles` (published only),
    `POST /api/contact`, `POST /api/auth/register`, `GET /api/health`.
  - Signed-in: `GET/POST /api/appointments` (patients only see their own), patients may cancel their own bookings.
  - Staff only: staff and article writes, appointment status changes, all appointments.
- All inputs are validated with Zod (`src/lib/validation.ts`); pricing is computed server-side.
- Rate limits: login (per email), register and contact (per IP). The limiter is in-memory; use a shared store
  (e.g. Redis) if you run more than one instance.
- Security headers and CSP are set in `next.config.mjs`.
- Demo data and demo accounts (password `demo1234`) are seeded **only outside production**
  (or when `SEED_DEMO_DATA=true`, which you should never set in production).

## Production checklist

- [ ] Strong, unique `NEXTAUTH_SECRET` and a dedicated MongoDB user with a strong password
- [ ] `NEXTAUTH_URL` set to the public HTTPS URL
- [ ] `SEED_DEMO_DATA` unset
- [ ] MongoDB encryption at rest, backups and network allow-list enabled
- [ ] If handling health data: privacy policy, consent, audit logging and retention rules per your jurisdiction
  (e.g. Ghana Data Protection Act 2012, GDPR, HIPAA) — these are organisational as well as technical requirements
