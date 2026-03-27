# TypeScript Typing Audit — Design Spec

## Overview

Complete typing audit of cofino-usados project using TypeScript advanced types, generics, utility types, discriminated unions, and `as const` patterns. Approach A: centralized type system + layer-by-layer refactor.

## Scope

6 layers, refactored in order: types base → auth → vehicle/formatters → hooks → components → pages/API/Zod.

---

## Section 1: Centralized Base Types

### New directory structure

```
types/
  index.ts              ← re-exports all types
  auth.ts               ← Role, SessionUser, AuthResponse
  vehicle.ts            ← VehicleDetail, VehicleImage (migrated from vehiculo.d.ts)
  forms.ts              ← shared form types
  api.ts                ← ApiResponse<T>, ApiError (discriminated union)
  filters.ts            ← SearchFilterValues, FilterOption, SearchParams
```

### Key decisions

- `Role` becomes `"USER" | "ADMIN"` literal union (not generic `string`)
- `VehicleImage` defined once — eliminates duplicate in `useGallery.ts`
- `ApiResponse<T>` as discriminated union:
  ```typescript
  type ApiResponse<T> =
    | { status: "success"; data: T }
    | { status: "error"; error: string }
  ```
- All data constants use `as const satisfies` for literal inference
- Delete `types/vehiculo/vehiculo.d.ts` after migration

---

## Section 2: Authentication Layer

### `types/auth.ts`

```typescript
export type Role = "USER" | "ADMIN"

export interface SessionUser {
  id: string
  fullName: string
  email: string
  phone: string
  role: Role
}
```

### `types/next-auth.d.ts`

- Import `Role` from `@/types/auth`
- Replace `role: string` with `role: Role` in both `User` and `Session` interfaces

### `auth.ts`

- Remove all `as any` (line 22-24: `phone: undefined as any`)
- Remove all `as string` assertions (lines 162-165 in session callback)
- Type `credentials` with dedicated interface instead of casting
- Type JWT callback using `Pick` from user instead of inline assertions
- Add explicit return types to `authorized`, JWT, and session callbacks

### `lib/auth-guard.ts`

- `requireAuth(): Promise<Session>`
- `requireAdmin(): Promise<Session>`

---

## Section 3: Vehicle Types & Formatters

### `types/vehicle.ts`

Migrate from `types/vehiculo/vehiculo.d.ts` with improvements:

```typescript
export interface VehicleImage {
  id: string
  url: string
  orden: number
}

export interface VehicleDetail {
  id: string
  nombre: string
  slug: string
  marca: string
  modelo: string
  año: number
  precio: number
  precioAnterior: number | null
  kilometraje: number
  transmision: string
  motor: string | null
  blindaje: string | boolean
  galeria: VehicleImage[]
  // ... rest of existing fields
}
```

### `lib/formatters/vehicle.ts`

Add explicit return types:

- `formatCurrency(value: number): string`
- `formatKilometers(value: number): string`
- `formatMotor(motor: string | null): string`
- `formatBlindaje(blindaje: string | boolean): string`

### Constants with `as const satisfies`

- `lib/constants/navigation.ts` — `navLinks`, `authLinks`, `footerLinks`
- `lib/constants/test-drive.ts` — all option arrays

---

## Section 4: Hooks — Return Types & Type Safety

### Pattern

Every hook gets an explicit return type interface:

```typescript
interface UseLoginFormReturn {
  form: UseFormReturn<AuthUserLoginData>
  onSubmit: (data: AuthUserLoginData) => Promise<void>
  isPending: boolean
}

export function useLoginForm(): UseLoginFormReturn { ... }
```

### Hooks to update

| Hook | File | Fixes |
|---|---|---|
| `useLoginForm` | `features/auth-users/hooks/` | Return type |
| `useRegisterForm` | `features/auth-users/hooks/` | Return type |
| `useAdminLoginForm` | `features/auth-dashboard/hooks/` | Return type, type `handleAction` |
| `usePurchaseForm` | `features/comprar/hooks/` | Return type, remove `false as unknown as true` |
| `useSearchFilters` | `features/filters/hooks/` | Return type, type `onFilterChange` |
| `useExchangeForm` | `features/intercambiar/hooks/` | Return type, `handleNext: Promise<void>` |
| `useTestDriveForm` | `features/test-drive/hooks/` | Return type, add Zod resolver |
| `useLoanCalculator` | `features/vehicle-detail/hooks/` | Return type, `BANKS` as const |
| `useGallery` | `features/vehicle-detail/hooks/` | Return type, delete duplicate `GalleryImage` |
| `useVideoPlayer` | `features/vehicle-detail/hooks/` | Return type |
| `useMonthlyPayment` | `features/vehicle-detail/hooks/` | Return type |
| `useNavbar` | `components/layout/hooks/` | Return type |

### Specific fix: `usePurchaseForm`

```typescript
// Before (unsafe)
acceptTerms: false as unknown as true,

// After
acceptTerms: false,  // Zod schema accepts boolean, validated on submit
```

---

## Section 5: Components — Props Interfaces & Return Types

### Pattern

```typescript
interface VehicleGridProps {
  vehicles: VehicleDetail[]
  className?: string
}

export function VehicleGrid({ vehicles, className }: VehicleGridProps): React.ReactElement { ... }
```

### Fixes by area

**`components/global/`**
- `vehicle-card.tsx` — extract `VehicleCardProps`, type favorite with boolean state

**`components/forms/`**
- `phone-field.tsx` — replace `Parameters<UseFormRegister<T>>[1]` with `RegisterOptions<T>`
- `password-field.tsx` — `inputProps` use `Omit<React.ComponentProps<"input">, "className" | "type" | "id">`

**`components/auth/`**
- `role-guard.tsx` — create type guard `isValidRole(role: string): role is Role`

**`features/comprar/components/`**
- `card-form.tsx` — type `MONTHS`, `YEARS` as `readonly string[]`
- `transfer-form.tsx` — return types on callbacks
- `vehicle-summary.tsx` — return types on helpers (`formatPriceWhole: string`, `getDecimals: string`, `formatDate: string`)

**`features/vehicle-detail/components/`**
- `video-showcase.tsx` — Props interfaces for 6 sub-components (`VideoOverlay`, `PlayButton`, `ProgressBar`, etc.)
- `vehicle-specs.tsx` — type `specs` array with `SpecItem` interface
- `vehicle-info.tsx` — return type, `STAR_INDICES` as const
- `loan-calculator.tsx` — type `currencyFormatter`

**`features/filters/components/`**
- `search-filter-bar.tsx` — consistent Props interface
- `home-search-bar.tsx` — return type

**Deduplication:**
- `SearchParams` in `app/page.tsx` and `app/home-content.tsx` → move to `types/filters.ts`

---

## Section 6: Pages, API Routes & Zod Schemas

### Pages — explicit return types

All page components get `Promise<React.ReactElement>` (async) or `React.ReactElement` (sync):

Affected: `page.tsx`, `login/page.tsx`, `auth/page.tsx`, `registro/page.tsx`, `dashboard/page.tsx`, `catalogo/[slug]/page.tsx`, `comprar/[slug]/page.tsx`, `error.tsx`, `catalogo/[slug]/error.tsx`

### API Routes

**`app/api/auth/register/route.ts`:**
- Type `body` as `unknown` → validate with Zod before use
- `catch (error: unknown)` with type guard
- Return type `Promise<NextResponse>` on `POST`

### Actions

- `app/actions/auth.ts` — explicit return types, extract shared logic between `registerUser`/`registerAdmin`
- `app/actions/vehiculo.ts` — use `import type`, type `where` as `Prisma.VehiculoWhereInput`
- `app/actions/vehiculo.cached.ts` — return types on all 4 cached functions
- `app/actions/filters.ts` — type `TRANSMISSION_OPTIONS`

### Zod Schemas

**`lib/validations/purchase.ts`:**
- Add `.min()`, `.regex()` to card fields (cardNumber, cvv, expMonth, expYear)
- Strengthen validation currently fragmented in `superRefine()`

**`lib/validations/test-drive.ts`:**
- Create full Zod schema (currently interface-only, no runtime validation)
- Connect to `useTestDriveForm` via `zodResolver`

### Import hygiene

- All type-only imports change to `import type { X }` across the project

---

## Verification

After each layer, run:

```bash
npm run build    # Prisma generate + Next.js build
npm run lint     # ESLint
```

Final verification: full build passes with zero type errors.
