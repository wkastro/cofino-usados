# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Generate Prisma client + build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

> `npm run build` runs `prisma generate` first — required when Prisma schema changes.

## Architecture

### Stack

- **Next.js 16** (App Router) with **React 19**
- **Tailwind CSS v4** (PostCSS-based, no `tailwind.config.js` — configured via `globals.css`)
- **Prisma** ORM with **MariaDB** (custom client output at `/generated/prisma/`)
- **NextAuth v5 beta** for authentication
- **React Hook Form + Zod** for form validation

### Route Structure

| Route | Description |
|---|---|
| `/` | Home — hero + vehicle grid |
| `/comprar` | Vehicle listing/purchase |
| `/test-drive` | Test drive booking |
| `/login`, `/registro` | User auth |
| `/auth` | Admin login |
| `/dashboard` | Admin panel (protected) |
| `/api/auth/[...nextauth]` | NextAuth handlers |
| `/api/auth/register` | User registration endpoint |

### Directory Layout

```
app/              # Next.js pages and API routes
components/
  ui/             # Base shadcn/Radix UI components
  layout/         # Header, footer, navbar, container
  global/         # Shared components (vehicle-card, logo)
  sections/       # Page-level sections (VehicleGrid)
  forms/          # Reusable form fields
  auth/           # Auth guards, social buttons
features/
  auth-users/     # User login/register (components + hooks)
  auth-dashboard/ # Admin login/register (components + hooks)
  test-drive/     # Test drive form (component + hook)
  filters/        # Search bars (home-search-bar, search-filter-bar)
  sections/home/  # Hero section
lib/
  hooks/          # useVehicleFavorites
  validations/    # Zod schemas
  formatters/     # vehicle.ts (currency, km, blindaje)
  constants/      # Nav, auth, test-drive constants
auth.ts           # NextAuth config (two credential providers)
prisma/schema.prisma
```

### Authentication

Two credential providers in `auth.ts`:
- `"user-login"` — for users with `role === "USER"`, gates `/login`
- `"admin-login"` — for users with `role === "ADMIN"`, gates `/auth` → `/dashboard`

JWT strategy with 30-day sessions. The JWT and session callbacks enrich tokens with `id`, `fullName`, `phone`, and `role`.

Authorization redirects:
- Authenticated USER visiting `/login` or `/registro` → `/`
- Authenticated ADMIN visiting `/auth` → `/dashboard`
- Unauthenticated user visiting `/dashboard` → `/auth`

### Data Patterns

- **Server components** fetch data directly or use Prisma
- **Client components** use React Hook Form + custom hooks for form state
- **Feature hooks** (e.g. `useLoginForm`, `useRegisterForm`, `useTestDriveForm`) encapsulate all form logic, validation, and API calls — components stay thin

### Key Conventions

- All imports use the `@/` alias (maps to project root)
- Client components are marked with `"use client"` at the top
- Zod schemas live in `lib/validations/` and are inferred with `z.infer<typeof schema>`
- `bcrypt` runs server-side only (`serverExternalPackages: ["bcrypt"]` in `next.config.ts`)
- Prisma client is generated to `/generated/prisma/` (not the default location)
