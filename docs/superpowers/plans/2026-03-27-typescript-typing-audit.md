# TypeScript Typing Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve type safety across the entire cofino-usados project by centralizing types, adding explicit return types, eliminating `any` usage, and applying TypeScript advanced type patterns.

**Architecture:** Create a centralized type system in `types/`, then refactor layer-by-layer: auth → vehicle/formatters → hooks → components → pages/API/Zod. Each layer builds on the previous one.

**Tech Stack:** TypeScript 5, Next.js 16, React 19, Prisma, NextAuth v5, React Hook Form, Zod

---

## File Structure

### New files
- `types/auth.ts` — Role literal union, SessionUser, AuthCredentials, ActionResult
- `types/api.ts` — ApiResponse<T> discriminated union
- `types/index.ts` — barrel re-export

### Files to modify (grouped by task)
- `types/next-auth.d.ts` — use Role type
- `types/vehiculo/vehiculo.d.ts` — stays, imports from new types
- `types/filters/filters.d.ts` — add SearchParams, SearchFilterValues
- `auth.ts` — remove all `as any`, `as string`, add return types
- `lib/auth-guard.ts` — add return types
- `lib/formatters/vehicle.ts` — add return types
- `lib/constants/navigation.ts` — add `as const satisfies`
- `lib/constants/test-drive.ts` — add `as const satisfies`
- `lib/validations/purchase.ts` — strengthen card field validation
- `lib/validations/test-drive.ts` — create Zod schema
- `features/*/hooks/*.ts` — all 13 hooks get return type interfaces
- `components/auth/role-guard.tsx` — use Role type + type guard
- `components/forms/phone-field.tsx` — use RegisterOptions
- `components/global/vehicle-card.tsx` — add return type
- `components/sections/home/vehicle-grid.tsx` — extract Props interface
- `features/filters/components/search-filter-bar.tsx` — move SearchFilterValues to types
- `features/filters/components/home-search-bar.tsx` — add return type
- `app/page.tsx` — use shared SearchParams, add return type
- `app/home-content.tsx` — use shared SearchParams, add return type
- `app/actions/auth.ts` — use centralized ActionResult, extract shared logic
- `app/actions/vehiculo.cached.ts` — add return types
- `app/api/auth/register/route.ts` — type body, add return type
- All page files — add return types

### Files to delete
- None (types stay in their current locations, we add new centralized types)

---

### Task 1: Create Centralized Auth Types

**Files:**
- Create: `types/auth.ts`
- Create: `types/api.ts`
- Create: `types/index.ts`

- [ ] **Step 1: Create `types/auth.ts`**

```typescript
// types/auth.ts
export type Role = "USER" | "ADMIN"

export interface SessionUser {
  id: string
  fullName: string
  email: string
  phone: string
  role: Role
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface ActionResult {
  success: boolean
  message: string
}
```

- [ ] **Step 2: Create `types/api.ts`**

```typescript
// types/api.ts
export type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string }
```

- [ ] **Step 3: Create `types/index.ts`**

```typescript
// types/index.ts
export type { Role, SessionUser, AuthCredentials, ActionResult } from "./auth"
export type { ApiResponse } from "./api"
export type {
  VehicleResponse,
  Vehiculo,
  VehicleRelation,
  VehicleTag,
  TagDetail,
  VehicleImage,
  VehicleDetail,
} from "./vehiculo/vehiculo"
export type {
  Category,
  Brand,
  Transmission,
  VehicleFilters,
} from "./filters/filters"
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS (no type errors)

- [ ] **Step 5: Commit**

```bash
git add types/auth.ts types/api.ts types/index.ts
git commit -m "feat(types): add centralized auth and api types"
```

---

### Task 2: Update NextAuth Type Declarations

**Files:**
- Modify: `types/next-auth.d.ts`

- [ ] **Step 1: Update `types/next-auth.d.ts` to use Role**

Replace the entire file with:

```typescript
import type { DefaultSession } from "next-auth"
import type { Role } from "@/types/auth"

declare module "next-auth" {
  interface User {
    fullName?: string
    phone?: string | null
    role?: Role
  }

  interface Session {
    user: {
      id: string
      fullName: string
      phone: string
      role: Role
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    fullName: string
    phone?: string
    role: Role
  }
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add types/next-auth.d.ts
git commit -m "feat(types): use Role literal union in NextAuth declarations"
```

---

### Task 3: Fix auth.ts — Remove `as any` and `as string`

**Files:**
- Modify: `auth.ts`

- [ ] **Step 1: Remove `as any` in createUser**

In `auth.ts`, replace lines 21-24:

```typescript
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                phone: undefined as any,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                password: undefined as any,
```

With:

```typescript
                phone: null,
                password: null,
```

Note: Prisma expects `null` for optional fields, not `undefined`. This removes the `as any` hack entirely.

- [ ] **Step 2: Remove `as string` casts in credentials authorize**

In `auth.ts`, for the `user-login` authorize callback, replace:

```typescript
                const email = (credentials?.email as string | undefined)?.trim().toLowerCase()
                const password = credentials?.password as string | undefined
```

With:

```typescript
                const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : undefined
                const password = typeof credentials?.password === "string" ? credentials.password : undefined
```

Do the same replacement for the `admin-login` authorize callback (same pattern appears twice).

- [ ] **Step 3: Remove inline type assertions in jwt callback**

In `auth.ts`, replace the jwt callback body:

```typescript
        async jwt({ token, user, account }) {
            // Credentials: enrich from the authorize return value
            if (user && account?.provider === "credentials") {
                token.id = user.id
                token.fullName = user.name
                token.phone = (user as { phone?: string | null }).phone ?? undefined
                token.role = (user as { role?: string }).role
            }
```

With:

```typescript
        async jwt({ token, user, account }) {
            // Credentials: enrich from the authorize return value
            if (user && account?.provider === "credentials") {
                token.id = user.id!
                token.fullName = user.name ?? ""
                token.phone = user.phone ?? undefined
                token.role = user.role ?? "USER"
            }
```

This works because Task 2 added `phone` and `role` to the NextAuth `User` interface.

- [ ] **Step 4: Remove `as string` in session callback**

Replace:

```typescript
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.fullName = token.fullName as string
                session.user.phone = token.phone as string
                session.user.role = token.role as string
            }
            return session
        },
```

With:

```typescript
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id
                session.user.fullName = token.fullName
                session.user.phone = token.phone ?? ""
                session.user.role = token.role
            }
            return session
        },
```

- [ ] **Step 5: Add return type to authorized callback**

Replace:

```typescript
        authorized({ auth, request: { nextUrl } }) {
```

With:

```typescript
        authorized({ auth, request: { nextUrl } }): boolean | Response {
```

- [ ] **Step 6: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add auth.ts
git commit -m "fix(auth): remove all as any and as string assertions"
```

---

### Task 4: Add Return Types to Auth Guard and Formatters

**Files:**
- Modify: `lib/auth-guard.ts`
- Modify: `lib/formatters/vehicle.ts`
- Modify: `lib/utils.ts`

- [ ] **Step 1: Add return types to `lib/auth-guard.ts`**

Replace the entire file with:

```typescript
import { redirect } from "next/navigation"
import type { Session } from "next-auth"
import { auth } from "@/auth"

export async function requireAuth(): Promise<Session> {
  const session = await auth()
  if (!session?.user) redirect("/login")
  return session
}

export async function requireAdmin(): Promise<Session> {
  const session = await auth()
  if (!session?.user) redirect("/auth")
  if (session.user.role !== "ADMIN") redirect("/")
  return session
}
```

- [ ] **Step 2: Add return types to `lib/formatters/vehicle.ts`**

Replace the entire file with:

```typescript
export function formatCurrency(value: number): string {
  return `Q${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`;
}

export function formatKilometers(value: number): string {
  return `${new Intl.NumberFormat("en-US").format(value)} km`;
}

export function formatMotor(motor: string | null): string {
  if (!motor) return "N/A";
  return `${(parseFloat(motor) / 1000).toFixed(1)}L`;
}

export function formatBlindaje(blindaje: string | boolean): string {
  if (typeof blindaje === "boolean") {
    return blindaje ? "Blindado" : "Sin blindaje";
  }
  return blindaje;
}
```

- [ ] **Step 3: Add return type to `lib/utils.ts`**

Replace:

```typescript
export function cn(...inputs: ClassValue[]) {
```

With:

```typescript
export function cn(...inputs: ClassValue[]): string {
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/auth-guard.ts lib/formatters/vehicle.ts lib/utils.ts
git commit -m "feat(types): add explicit return types to auth-guard, formatters, utils"
```

---

### Task 5: Type Constants with `as const satisfies`

**Files:**
- Modify: `lib/constants/navigation.ts`
- Modify: `lib/constants/test-drive.ts`

- [ ] **Step 1: Add types to `lib/constants/navigation.ts`**

Add type interfaces and `as const satisfies` to each export. Replace the entire file:

```typescript
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  TikTokIcon,
} from "@/components/layout/footer-icons";

interface NavLink {
  readonly label: string;
  readonly href: string;
}

interface SocialLink extends NavLink {
  readonly icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const navLinks = [
  { label: "Intercambiar", href: "/intercambiar" },
  { label: "Próximamente", href: "/proximamente" },
  { label: "Certificados", href: "/certificados" },
] as const satisfies readonly NavLink[];

export const footerMenuLinks = [
  { label: "Comprar", href: "/comprar" },
  { label: "Intercambiar auto", href: "/intercambiar" },
  { label: "Próximamente", href: "/proximamente" },
  { label: "Certificados", href: "/certificados" },
  { label: "Consignación", href: "/consignacion" },
] as const satisfies readonly NavLink[];

export const footerBranches = [
  "Agencia Calzada Roosevelt",
  "Agencia Yurrita",
  "Agencia Arrazola",
] as const;

export const footerSocialLinks: readonly SocialLink[] = [
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "X", href: "#", icon: XIcon },
  { label: "TikTok", href: "#", icon: TikTokIcon },
];
```

- [ ] **Step 2: Add types to `lib/constants/test-drive.ts`**

Replace the entire file:

```typescript
interface SelectOption {
  readonly value: string;
  readonly label: string;
}

export const CONTACT_METHOD_OPTIONS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "llamada", label: "Llamada telefónica" },
  { value: "correo", label: "Correo electrónico" },
] as const satisfies readonly SelectOption[];

export const TEST_DRIVE_TYPE_OPTIONS = [
  { value: "presencial", label: "Presencial" },
  { value: "domicilio", label: "A domicilio" },
] as const satisfies readonly SelectOption[];

export const TEST_DRIVE_START_TIMES = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
] as const;

export const TEST_DRIVE_END_TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
] as const;

export const TEST_DRIVE_BRANCHES = [
  { value: "roosevelt", label: "Agencia Calzada Roosevelt" },
  { value: "yurrita", label: "Agencia Yurrita" },
  { value: "arrazola", label: "Agencia Arrazola" },
] as const satisfies readonly SelectOption[];

export const TEST_DRIVE_STEP_1_FIELDS = [
  "name",
  "email",
  "phoneCode",
  "phone",
  "contactMethod",
] as const;
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add lib/constants/navigation.ts lib/constants/test-drive.ts
git commit -m "feat(types): add as const satisfies to constant arrays"
```

---

### Task 6: Strengthen Zod Schemas

**Files:**
- Modify: `lib/validations/purchase.ts`
- Modify: `lib/validations/test-drive.ts`

- [ ] **Step 1: Strengthen purchase schema card fields**

In `lib/validations/purchase.ts`, replace the card/transfer field declarations (lines 9-18):

```typescript
    // Card fields
    cardNumber: z.string(),
    cardName: z.string(),
    expMonth: z.string(),
    expYear: z.string(),
    cvv: z.string(),
    nit: z.string(),
    // Transfer fields
    bankName: z.string(),
    accountNumber: z.string(),
    authNumber: z.string(),
```

With:

```typescript
    // Card fields
    cardNumber: z.string().max(19),
    cardName: z.string().max(100),
    expMonth: z.string().max(2),
    expYear: z.string().max(4),
    cvv: z.string().max(4),
    nit: z.string().max(20),
    // Transfer fields
    bankName: z.string().max(100),
    accountNumber: z.string().max(30),
    authNumber: z.string().max(30),
```

Note: Real min-length validation already happens in `superRefine()`. We add max-length bounds for safety.

- [ ] **Step 2: Create Zod schema for test-drive**

Replace the entire `lib/validations/test-drive.ts` with:

```typescript
import { z } from "zod";

export const testDriveSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  phoneCode: z.string().min(1, "Selecciona un código"),
  phone: z
    .string()
    .min(8, "Ingresa un número de teléfono válido")
    .regex(/^[\d\s+()-]{7,15}$/, "Formato de teléfono inválido"),
  contactMethod: z.string().min(1, "Selecciona un método de contacto"),
  testDriveType: z.string().min(1, "Selecciona el tipo de prueba"),
  testDate: z.coerce.date({ message: "Selecciona una fecha" }),
  startTime: z.string().min(1, "Selecciona hora de inicio"),
  endTime: z.string().min(1, "Selecciona hora de fin"),
  branch: z.string().min(1, "Selecciona una sucursal"),
  acceptContact: z.literal(true, {
    message: "Debes aceptar ser contactado",
  }),
});

export type TestDriveFormData = z.infer<typeof testDriveSchema>;
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add lib/validations/purchase.ts lib/validations/test-drive.ts
git commit -m "feat(validations): strengthen purchase schema, create test-drive Zod schema"
```

---

### Task 7: Add Return Types to Auth Hooks

**Files:**
- Modify: `features/auth-users/hooks/useLoginForm.ts`
- Modify: `features/auth-users/hooks/useRegisterForm.ts`
- Modify: `features/auth-dashboard/hooks/useAdminLoginForm.ts`
- Modify: `features/auth-dashboard/hooks/useAdminRegisterForm.ts`

- [ ] **Step 1: Add return type to `useLoginForm`**

In `features/auth-users/hooks/useLoginForm.ts`, add the interface and return type.

After the imports, before the function, add:

```typescript
import type {
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";

interface UseLoginFormReturn {
  register: UseFormRegister<AuthUserLoginData>;
  handleSubmit: ReturnType<typeof useForm<AuthUserLoginData>>["handleSubmit"];
  errors: FieldErrors<AuthUserLoginData>;
  onSubmit: (data: AuthUserLoginData) => void;
  error: string;
  isPending: boolean;
  showPassword: boolean;
  togglePassword: () => void;
}
```

Note: Since `useForm` is already imported, we need to import the additional types. Update the existing import:

Replace:

```typescript
import { useForm } from "react-hook-form";
```

With:

```typescript
import { useForm, type UseFormRegister, type FieldErrors, type UseFormHandleSubmit } from "react-hook-form";
```

Add the interface after imports:

```typescript
interface UseLoginFormReturn {
  register: UseFormRegister<AuthUserLoginData>;
  handleSubmit: UseFormHandleSubmit<AuthUserLoginData>;
  errors: FieldErrors<AuthUserLoginData>;
  onSubmit: (data: AuthUserLoginData) => void;
  error: string;
  isPending: boolean;
  showPassword: boolean;
  togglePassword: () => void;
}
```

Then change the function signature:

```typescript
export function useLoginForm(): UseLoginFormReturn {
```

- [ ] **Step 2: Add return type to `useRegisterForm`**

In `features/auth-users/hooks/useRegisterForm.ts`, update the import:

Replace:

```typescript
import { useForm } from "react-hook-form";
```

With:

```typescript
import { useForm, type UseFormRegister, type FieldErrors, type UseFormHandleSubmit, type Control } from "react-hook-form";
```

Add after imports:

```typescript
interface UseRegisterFormReturn {
  register: UseFormRegister<AuthUserRegisterData>;
  control: Control<AuthUserRegisterData>;
  handleSubmit: UseFormHandleSubmit<AuthUserRegisterData>;
  errors: FieldErrors<AuthUserRegisterData>;
  onSubmit: (data: AuthUserRegisterData) => void;
  error: string;
  isPending: boolean;
  showPassword: boolean;
  togglePassword: () => void;
}
```

Change signature:

```typescript
export function useRegisterForm(): UseRegisterFormReturn {
```

- [ ] **Step 3: Add return type to `useAdminLoginForm`**

In `features/auth-dashboard/hooks/useAdminLoginForm.ts`, add after imports:

```typescript
interface UseAdminLoginFormReturn {
  handleAction: (formData: FormData) => void;
  error: string;
  isPending: boolean;
}
```

Change signature:

```typescript
export function useAdminLoginForm(): UseAdminLoginFormReturn {
```

- [ ] **Step 4: Add return type to `useAdminRegisterForm`**

In `features/auth-dashboard/hooks/useAdminRegisterForm.ts`, update the import:

Replace:

```typescript
import { useForm } from "react-hook-form";
```

With:

```typescript
import { useForm, type UseFormRegister, type FieldErrors, type UseFormHandleSubmit, type Control } from "react-hook-form";
```

Add after imports:

```typescript
interface UseAdminRegisterFormReturn {
  register: UseFormRegister<AuthDashboardRegisterData>;
  control: Control<AuthDashboardRegisterData>;
  handleSubmit: UseFormHandleSubmit<AuthDashboardRegisterData>;
  errors: FieldErrors<AuthDashboardRegisterData>;
  onSubmit: (data: AuthDashboardRegisterData) => void;
  error: string;
  isPending: boolean;
  showPassword: boolean;
  togglePassword: () => void;
}
```

Change signature:

```typescript
export function useAdminRegisterForm(): UseAdminRegisterFormReturn {
```

- [ ] **Step 5: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add features/auth-users/hooks/ features/auth-dashboard/hooks/
git commit -m "feat(types): add explicit return types to auth hooks"
```

---

### Task 8: Add Return Types to Feature Hooks

**Files:**
- Modify: `features/comprar/hooks/usePurchaseForm.ts`
- Modify: `features/filters/hooks/useSearchFilters.ts`
- Modify: `features/intercambiar/hooks/useExchangeForm.ts`
- Modify: `features/test-drive/hooks/useTestDriveForm.ts`

- [ ] **Step 1: Fix and type `usePurchaseForm`**

In `features/comprar/hooks/usePurchaseForm.ts`, update the import:

Replace:

```typescript
import { useForm } from "react-hook-form";
```

With:

```typescript
import { useForm, type UseFormRegister, type FieldErrors, type UseFormHandleSubmit, type Control } from "react-hook-form";
```

Add after imports:

```typescript
interface UsePurchaseFormReturn {
  register: UseFormRegister<PurchaseFormData>;
  control: Control<PurchaseFormData>;
  handleSubmit: UseFormHandleSubmit<PurchaseFormData>;
  errors: FieldErrors<PurchaseFormData>;
  isSubmitting: boolean;
  paymentMethod: PurchaseFormData["paymentMethod"];
  onSubmit: (data: PurchaseFormData) => void;
}
```

Change signature:

```typescript
export function usePurchaseForm(): UsePurchaseFormReturn {
```

**Fix unsafe cast** — replace:

```typescript
      acceptTerms: false as unknown as true,
      acceptNoRefund: false as unknown as true,
```

With:

```typescript
      acceptTerms: false as const,
      acceptNoRefund: false as const,
```

Note: The form will show validation errors on submit since these are `z.literal(true)`. Using `false as const` is type-safe — it just means the default won't pass validation, which is correct behavior.

- [ ] **Step 2: Type `useSearchFilters`**

In `features/filters/hooks/useSearchFilters.ts`, add after imports:

```typescript
interface UseSearchFiltersReturn {
  values: SearchFilterValues;
  onFilterChange: (field: keyof SearchFilterValues, value: string) => void;
  handleSearch: () => void;
  handleFiltersClick: () => void;
}
```

Change signature:

```typescript
export function useSearchFilters(): UseSearchFiltersReturn {
```

- [ ] **Step 3: Type `useExchangeForm`**

In `features/intercambiar/hooks/useExchangeForm.ts`, update import:

Replace:

```typescript
import { useForm } from "react-hook-form";
```

With:

```typescript
import { useForm, type UseFormRegister, type FieldErrors, type UseFormHandleSubmit, type Control } from "react-hook-form";
```

Add after imports:

```typescript
interface UseExchangeFormReturn {
  register: UseFormRegister<ExchangeFormData>;
  control: Control<ExchangeFormData>;
  handleSubmit: UseFormHandleSubmit<ExchangeFormData>;
  errors: FieldErrors<ExchangeFormData>;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  wantsExchange: boolean;
  selectedBrand: string;
  handleNext: () => Promise<void>;
  onSubmit: (data: ExchangeFormData) => void;
}
```

Change signature:

```typescript
export function useExchangeForm(): UseExchangeFormReturn {
```

Add `import type React from "react"` at the top if not present (or use `Dispatch<SetStateAction<number>>` from react directly).

Actually, since `useState` is already imported from react, just import the types:

Replace:

```typescript
import { useState } from "react";
```

With:

```typescript
import { useState, type Dispatch, type SetStateAction } from "react";
```

And in the interface use:

```typescript
  setStep: Dispatch<SetStateAction<number>>;
```

- [ ] **Step 4: Type `useTestDriveForm` and connect Zod**

Replace the entire `features/test-drive/hooks/useTestDriveForm.ts`:

```typescript
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm, type UseFormRegister, type FieldErrors, type UseFormHandleSubmit, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TEST_DRIVE_STEP_1_FIELDS } from "@/lib/constants/test-drive";
import { testDriveSchema, type TestDriveFormData } from "@/lib/validations/test-drive";

interface UseTestDriveFormReturn {
  register: UseFormRegister<TestDriveFormData>;
  control: Control<TestDriveFormData>;
  handleSubmit: UseFormHandleSubmit<TestDriveFormData>;
  errors: FieldErrors<TestDriveFormData>;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  handleNext: () => Promise<void>;
  onSubmit: (data: TestDriveFormData) => void;
}

export function useTestDriveForm(): UseTestDriveFormReturn {
  const [step, setStep] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<TestDriveFormData>({
    resolver: zodResolver(testDriveSchema),
    defaultValues: {
      phoneCode: "+502",
      acceptContact: false as const,
    },
  });

  async function handleNext(): Promise<void> {
    const valid = await trigger([...TEST_DRIVE_STEP_1_FIELDS]);
    if (valid) setStep(1);
  }

  function onSubmit(_data: TestDriveFormData): void {
    // TODO: implement server action for test drive form submission
  }

  return {
    register,
    control,
    handleSubmit,
    errors,
    step,
    setStep,
    handleNext,
    onSubmit,
  };
}
```

- [ ] **Step 5: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add features/comprar/hooks/ features/filters/hooks/ features/intercambiar/hooks/ features/test-drive/hooks/
git commit -m "feat(types): add return types to feature hooks, connect test-drive Zod schema"
```

---

### Task 9: Add Return Types to Vehicle Detail and Layout Hooks

**Files:**
- Modify: `features/vehicle-detail/hooks/useLoanCalculator.ts`
- Modify: `features/vehicle-detail/hooks/useGallery.ts`
- Modify: `features/vehicle-detail/hooks/useVideoPlayer.ts`
- Modify: `features/vehicle-detail/hooks/useMonthlyPayment.ts`
- Modify: `components/layout/hooks/useNavbar.ts`

- [ ] **Step 1: Type `useLoanCalculator`**

In `features/vehicle-detail/hooks/useLoanCalculator.ts`, add `as const` to constants and return type.

After the constant declarations, add:

```typescript
interface Bank {
  readonly id: string;
  readonly nombre: string;
}

const BANKS: readonly Bank[] = [
  { id: "bi", nombre: "Banco Industrial" },
  { id: "banrural", nombre: "Banrural" },
  { id: "bac", nombre: "BAC Credomatic" },
  { id: "gyt", nombre: "G&T Continental" },
  { id: "interbanco", nombre: "Interbanco" },
];

const INSTALLMENT_OPTIONS = [12, 24, 36, 48, 60, 72] as const;
```

Replace the original `BANKS` and `INSTALLMENT_OPTIONS` declarations with the above.

Add return type interface:

```typescript
interface UseLoanCalculatorReturn {
  bank: string;
  installments: string;
  monthlyPayment: number | null;
  banks: readonly Bank[];
  installmentOptions: typeof INSTALLMENT_OPTIONS;
  onBankChange: (value: string) => void;
  onInstallmentsChange: (value: string) => void;
}
```

Change signature:

```typescript
export function useLoanCalculator(vehiclePrice: number): UseLoanCalculatorReturn {
```

- [ ] **Step 2: Type `useGallery` — use VehicleImage from types**

Replace the entire `features/vehicle-detail/hooks/useGallery.ts`:

```typescript
import { useState, useCallback } from "react";
import type { VehicleImage } from "@/types/vehiculo/vehiculo";

interface UseGalleryReturn {
  selectedImage: VehicleImage;
  selectedIndex: number;
  selectImage: (index: number) => void;
}

export function useGallery(images: VehicleImage[]): UseGalleryReturn {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedImage = images[selectedIndex] ?? images[0];

  const selectImage = useCallback(
    (index: number) => {
      if (index >= 0 && index < images.length) {
        setSelectedIndex(index);
      }
    },
    [images.length],
  );

  return {
    selectedImage,
    selectedIndex,
    selectImage,
  };
}
```

- [ ] **Step 3: Type `useVideoPlayer`**

In `features/vehicle-detail/hooks/useVideoPlayer.ts`, add return types.

After the `VideoSource` type, add:

```typescript
interface UseVideoPlayerReturn {
  isPlaying: boolean;
  play: () => void;
  stop: () => void;
}
```

Change the function signatures:

```typescript
function extractYouTubeId(url: string): string {
```
(Already typed — no change needed)

```typescript
export function getVideoSource(url: string): VideoSource {
```
(Already typed — no change needed)

```typescript
export function useVideoPlayer(): UseVideoPlayerReturn {
```

- [ ] **Step 4: Type `useMonthlyPayment`**

In `features/vehicle-detail/hooks/useMonthlyPayment.ts`, add:

```typescript
interface UseMonthlyPaymentReturn {
  monthlyPayment: number;
}

export function useMonthlyPayment(price: number): UseMonthlyPaymentReturn {
```

- [ ] **Step 5: Type `useNavbar`**

In `components/layout/hooks/useNavbar.ts`, add after imports:

```typescript
interface UseNavbarReturn {
  mobileMenuOpen: boolean;
  isHome: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  isActiveLink: (href: string) => boolean;
}
```

Change signature:

```typescript
export function useNavbar(): UseNavbarReturn {
```

- [ ] **Step 6: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add features/vehicle-detail/hooks/ components/layout/hooks/
git commit -m "feat(types): add return types to vehicle-detail and layout hooks"
```

---

### Task 10: Improve Component Types — Forms and Auth

**Files:**
- Modify: `components/forms/phone-field.tsx`
- Modify: `components/auth/role-guard.tsx`

- [ ] **Step 1: Fix `phone-field.tsx` — use RegisterOptions**

In `components/forms/phone-field.tsx`, replace the import:

```typescript
import {
  Control,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
```

With:

```typescript
import {
  type Control,
  type FieldValues,
  type Path,
  type UseFormRegister,
  type RegisterOptions,
} from "react-hook-form";
```

In the `PhoneFieldProps` interface, replace:

```typescript
  phoneRegisterOptions?: Parameters<UseFormRegister<T>>[1];
```

With:

```typescript
  phoneRegisterOptions?: RegisterOptions<T, Path<T>>;
```

Add return type to the component:

```typescript
export function PhoneField<T extends FieldValues>({
  ...
}: PhoneFieldProps<T>): React.ReactElement {
```

- [ ] **Step 2: Fix `role-guard.tsx` — use Role type and type guard**

Replace the entire `components/auth/role-guard.tsx`:

```typescript
"use client";

import { useSession } from "next-auth/react";
import type { ReactNode } from "react";
import type { Role } from "@/types/auth";

interface RoleGuardProps {
  role: Role;
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({ role, children, fallback = null }: RoleGuardProps): React.ReactElement {
  const { data: session } = useSession();

  if (session?.user?.role !== role) return <>{fallback}</>;

  return <>{children}</>;
}
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/forms/phone-field.tsx components/auth/role-guard.tsx
git commit -m "feat(types): use RegisterOptions in phone-field, Role literal in role-guard"
```

---

### Task 11: Improve Component Types — Vehicle Card and Grid

**Files:**
- Modify: `components/global/vehicle-card.tsx`
- Modify: `components/sections/home/vehicle-grid.tsx`

- [ ] **Step 1: Add return type to `vehicle-card.tsx`**

In `components/global/vehicle-card.tsx`, change:

```typescript
import { Vehiculo } from "@/types/vehiculo/vehiculo";
```

To:

```typescript
import type { Vehiculo } from "@/types/vehiculo/vehiculo";
```

Add return type:

```typescript
export function VehicleCard({ vehicle }: VehicleCardProps): React.ReactElement {
```

Add the React import at top if not present:

```typescript
import type React from "react";
```

- [ ] **Step 2: Extract Props interface for `vehicle-grid.tsx`**

In `components/sections/home/vehicle-grid.tsx`, change:

```typescript
import type { VehicleResponse } from "@/types/vehiculo/vehiculo";
```

Replace inline props with named interface:

```typescript
interface VehicleGridProps {
  vehicles: VehicleResponse;
}

export function VehicleGrid({ vehicles }: VehicleGridProps): React.ReactElement {
```

Add `import type React from "react";` at top.

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/global/vehicle-card.tsx components/sections/home/vehicle-grid.tsx
git commit -m "feat(types): add return types and Props interfaces to vehicle components"
```

---

### Task 12: Move SearchFilterValues and SearchParams to Types

**Files:**
- Modify: `types/filters/filters.d.ts`
- Modify: `features/filters/components/search-filter-bar.tsx`
- Modify: `features/filters/hooks/useSearchFilters.ts`
- Modify: `app/page.tsx`
- Modify: `app/home-content.tsx`

- [ ] **Step 1: Add shared types to `types/filters/filters.d.ts`**

Add to the end of `types/filters/filters.d.ts`:

```typescript

export interface SearchFilterValues {
  marca: string;
  categoria: string;
  transmision: string;
}

export interface SearchParams {
  marca?: string;
  categoria?: string;
  transmision?: string;
}
```

- [ ] **Step 2: Update `search-filter-bar.tsx` to import from types**

In `features/filters/components/search-filter-bar.tsx`, remove the local `SearchFilterValues` interface (lines 18-22) and import from types:

Replace:

```typescript
import type { Brand, Category, Transmission } from "@/types/filters/filters";

export interface SearchFilterValues {
  marca: string;
  categoria: string;
  transmision: string;
}
```

With:

```typescript
import type { Brand, Category, Transmission, SearchFilterValues } from "@/types/filters/filters";
```

Keep the `SearchFilterBarProps` interface but remove the re-exported `SearchFilterValues`.

- [ ] **Step 3: Update `useSearchFilters.ts` to import from types**

In `features/filters/hooks/useSearchFilters.ts`, replace:

```typescript
import type { SearchFilterValues } from "../components/search-filter-bar";
```

With:

```typescript
import type { SearchFilterValues } from "@/types/filters/filters";
```

- [ ] **Step 4: Update `app/page.tsx` to use shared SearchParams**

In `app/page.tsx`, replace:

```typescript
interface HomeProps {
  searchParams: Promise<{ marca?: string; categoria?: string; transmision?: string }>;
}
```

With:

```typescript
import type { SearchParams } from "@/types/filters/filters";

interface HomeProps {
  searchParams: Promise<SearchParams>;
}
```

Add return type:

```typescript
export default async function Home({ searchParams }: HomeProps): Promise<React.ReactElement> {
```

Add `import type React from "react";` if not present.

- [ ] **Step 5: Update `app/home-content.tsx` to use shared SearchParams**

In `app/home-content.tsx`, replace:

```typescript
interface HomeContentProps {
  searchParams: Promise<{ marca?: string; categoria?: string; transmision?: string }>;
}
```

With:

```typescript
import type { SearchParams } from "@/types/filters/filters";

interface HomeContentProps {
  searchParams: Promise<SearchParams>;
}
```

Add return types:

```typescript
export async function HomeSearchBarContent({ searchParams }: HomeContentProps): Promise<React.ReactElement> {
```

```typescript
export async function HomeVehicleGrid({ searchParams }: HomeContentProps): Promise<React.ReactElement> {
```

- [ ] **Step 6: Update `types/index.ts` to re-export new types**

Add to `types/index.ts`:

```typescript
export type { SearchFilterValues, SearchParams } from "./filters/filters"
```

- [ ] **Step 7: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add types/filters/filters.d.ts types/index.ts features/filters/components/search-filter-bar.tsx features/filters/hooks/useSearchFilters.ts app/page.tsx app/home-content.tsx
git commit -m "feat(types): centralize SearchFilterValues and SearchParams, eliminate duplication"
```

---

### Task 13: Add Return Types to Pages

**Files:**
- Modify: `app/login/page.tsx`
- Modify: `app/auth/page.tsx`
- Modify: `app/registro/page.tsx`
- Modify: `app/dashboard/page.tsx`
- Modify: `app/catalogo/[slug]/page.tsx`
- Modify: `app/comprar/[slug]/page.tsx`
- Modify: `app/error.tsx`
- Modify: `app/catalogo/[slug]/error.tsx`
- Modify: `app/catalogo/[slug]/vehicle-detail.tsx`

- [ ] **Step 1: Add return types to simple pages**

`app/login/page.tsx` — change:
```typescript
export default function SignIn() {
```
To:
```typescript
export default function SignIn(): React.ReactElement {
```
Add `import type React from "react";` at top.

`app/auth/page.tsx` — change:
```typescript
export default function LoginPage() {
```
To:
```typescript
export default function LoginPage(): React.ReactElement {
```
Add `import type React from "react";` at top.

`app/registro/page.tsx` — change:
```typescript
export default function RegisterPage() {
```
To:
```typescript
export default function RegisterPage(): React.ReactElement {
```
Add `import type React from "react";` at top.

`app/dashboard/page.tsx` — change:
```typescript
export default function Page() {
```
To:
```typescript
export default function Page(): React.ReactElement {
```
Add `import type React from "react";` at top.

- [ ] **Step 2: Add return types to async pages**

`app/catalogo/[slug]/page.tsx` — change:
```typescript
export default async function VehiclePage({ params }: VehiclePageProps) {
```
To:
```typescript
export default async function VehiclePage({ params }: VehiclePageProps): Promise<React.ReactElement> {
```
Add `import type React from "react";` at top.

`app/comprar/[slug]/page.tsx` — change:
```typescript
export default async function BuyPage({ params }: BuyPageProps) {
```
To:
```typescript
export default async function BuyPage({ params }: BuyPageProps): Promise<React.ReactElement> {
```
Add `import type React from "react";` at top.

- [ ] **Step 3: Add return types to error pages**

`app/error.tsx` — change:
```typescript
export default function GlobalError({ error, reset }: ErrorProps) {
```
To:
```typescript
export default function GlobalError({ error, reset }: ErrorProps): React.ReactElement {
```
Add `import type React from "react";` at top.

`app/catalogo/[slug]/error.tsx` — change:
```typescript
export default function VehicleError({ error, reset }: ErrorProps) {
```
To:
```typescript
export default function VehicleError({ error, reset }: ErrorProps): React.ReactElement {
```
Add `import type React from "react";` at top.

- [ ] **Step 4: Add return type to vehicle-detail component**

`app/catalogo/[slug]/vehicle-detail.tsx` — change:
```typescript
export async function VehicleDetail({ params }: VehicleDetailProps) {
```
To:
```typescript
export async function VehicleDetail({ params }: VehicleDetailProps): Promise<React.ReactElement> {
```
Add `import type React from "react";` at top.

- [ ] **Step 5: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add app/login/page.tsx app/auth/page.tsx app/registro/page.tsx app/dashboard/page.tsx app/catalogo/[slug]/page.tsx app/comprar/[slug]/page.tsx app/error.tsx app/catalogo/[slug]/error.tsx app/catalogo/[slug]/vehicle-detail.tsx
git commit -m "feat(types): add explicit return types to all page components"
```

---

### Task 14: Improve API Route and Actions Types

**Files:**
- Modify: `app/api/auth/register/route.ts`
- Modify: `app/actions/auth.ts`
- Modify: `app/actions/vehiculo.cached.ts`

- [ ] **Step 1: Type the API register route**

Replace the entire `app/api/auth/register/route.ts`:

```typescript
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations/auth"

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: unknown = await request.json()

    const result = registerSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return NextResponse.json(
        { message: "Datos de registro inválidos", errors },
        { status: 400 }
      )
    }

    const { fullName, email, phone, password } = result.data

    const sanitizedEmail = email.trim().toLowerCase()
    const sanitizedName = fullName.trim()

    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "Ya existe una cuenta con este correo electrónico" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        fullName: sanitizedName,
        email: sanitizedEmail,
        phone,
        password: hashedPassword,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      { message: "Cuenta creada exitosamente", user },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 2: Use centralized ActionResult in actions/auth.ts**

In `app/actions/auth.ts`, replace the local `ActionResult` interface:

Replace:

```typescript
import { registerSchema } from "@/lib/validations/auth"

interface ActionResult {
  success: boolean;
  message: string;
}
```

With:

```typescript
import { registerSchema } from "@/lib/validations/auth"
import type { ActionResult } from "@/types/auth"
```

- [ ] **Step 3: Add return types to cached functions**

In `app/actions/vehiculo.cached.ts`, add return types:

Replace:

```typescript
import type { VehicleFilters } from "@/types/filters/filters";
```

With:

```typescript
import type { VehicleFilters } from "@/types/filters/filters";
import type { VehicleDetail, VehicleResponse } from "@/types/vehiculo/vehiculo";
import type { CategoriesResult, BrandsResult } from "./filters";
```

Add return types to each function:

```typescript
export async function getCachedVehicleBySlug(slug: string): Promise<VehicleDetail | null> {
```

```typescript
export async function getCachedVehiculos(
  page = 1,
  filters: VehicleFilters = {},
): Promise<VehicleResponse> {
```

```typescript
export async function getCachedCategories(): Promise<CategoriesResult> {
```

```typescript
export async function getCachedBrands(): Promise<BrandsResult> {
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/api/auth/register/route.ts app/actions/auth.ts app/actions/vehiculo.cached.ts
git commit -m "feat(types): type API route, centralize ActionResult, add cached function return types"
```

---

### Task 15: Final Verification

**Files:** None (verification only)

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with zero type errors

- [ ] **Step 2: Run linter**

Run: `npm run lint`
Expected: No new lint errors introduced

- [ ] **Step 3: Verify no remaining `as any` in codebase**

Run: `grep -r "as any" --include="*.ts" --include="*.tsx" -l`
Expected: No matches in project source files (node_modules excluded)

- [ ] **Step 4: Commit any remaining fixes if needed**

Only if steps 1-3 revealed issues.
