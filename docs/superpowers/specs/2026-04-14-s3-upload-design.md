# S3 Upload Service — Design Spec

**Date:** 2026-04-14  
**Branch:** file-upload  
**Status:** Approved

---

## Overview

Implement an AWS S3 (LightSail Object Storage) upload service encapsulated in `features/s3`, using `better-upload` as the upload library. The first consumer is the vehicle gallery form in `app/dashboard/vehiculos/`. The feature is designed to scale to other dashboard entities (reviews, documents, etc.).

---

## Architecture

### Approach: Hook-based with centralized route handler

- `features/s3` owns all upload configuration (router, S3 client, key generation)
- `app/api/upload/route.ts` exposes the POST handler by importing from `features/s3`
- Client components use `useUploadFiles` / `useUploadFile` hooks from `@better-upload/client`
- No adapter pattern — better-upload is hook-first; the existing `upload-adapter.ts` is removed

### Data Flow

```
[Admin selects files in StepGaleria]
        ↓
  useUploadFiles({ route: 'vehiculo-images' })
        ↓  POST /api/upload
  better-upload route handler
        ↓  presigned URL
  Direct upload to S3 (LightSail)
        ↓  onUploadComplete per file
  addGaleriaImage(vehiculoId, publicUrl)
        ↓
  Prisma DB (galeria table)
```

---

## Directory Structure

```
features/s3/
  client.ts          # AWS S3 client configured for LightSail endpoint
  router.ts          # better-upload Router — defines all upload routes
  keys.ts            # Key generation: {type}/vehiculos/{id}/{timestamp}-{filename}
  index.ts           # Public exports: router, key utilities, route name constants

app/api/upload/
  route.ts           # POST handler — toRouteHandler(router) from features/s3
```

---

## `features/s3` Module

### `client.ts`
Instantiates the `@aws-sdk/client-s3` (used internally by better-upload's `aws()` helper) configured for LightSail:
- Endpoint: derived from `AWS_BASE_URL`
- Region: `AWS_REGION` (us-east-2)
- Credentials: `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY`
- Force path style: required for LightSail buckets

### `keys.ts`
Generates deterministic S3 object keys:

| File type | Key pattern |
|-----------|-------------|
| Images    | `images/{entity}/{entityId}/{timestamp}-{sanitizedName}` |
| Videos    | `videos/{entity}/{entityId}/{timestamp}-{sanitizedName}` |
| Documents | `documents/{entity}/{entityId}/{timestamp}-{sanitizedName}` |

Public URL: `https://{AWS_BASE_URL}/{key}`

### `router.ts`
Defines better-upload routes. Initial routes:

| Route name          | Types           | Max size | Multiple |
|---------------------|-----------------|----------|----------|
| `vehiculo-images`   | `image/*`       | 5 MB     | Yes (10) |
| `vehiculo-videos`   | `video/*`       | 100 MB   | Yes (3)  |
| `vehiculo-documents`| `application/pdf`, `text/*` | 20 MB | Yes (5) |

Each route uses `onBeforeUpload` to generate the key via `keys.ts` and requires admin auth via `requireAdmin()`.

### `index.ts`
Re-exports:
- `router` (for the route handler)
- `UPLOAD_ROUTES` constant (typed route names, avoids magic strings)
- `buildPublicUrl(key)` utility

---

## Route Handler

**`app/api/upload/route.ts`**

```ts
import { toRouteHandler } from '@better-upload/server/adapters/next'
import { router } from '@/features/s3'

export const { POST } = toRouteHandler(router)
```

Simple passthrough — all configuration lives in `features/s3`.

---

## `StepGaleria` Changes

- Remove `adapter` prop and `UploadAdapter` type reference
- Remove URL text input and manual add button
- Add file picker / dropzone using `useUploadFiles({ route: UPLOAD_ROUTES.vehiculoImages })`
- Show per-file progress (0–100%) during upload
- On `onUploadComplete`: call `addGaleriaImage(vehiculoId, publicUrl)` — same action as before
- If `vehiculoId` is null (create mode): store URL in local state, same behavior as today
- Errors shown via `toast.error` — consistent with rest of form

### Files modified
- `features/dashboard/vehiculos/components/vehiculo-form/steps/step-galeria.tsx` — new implementation
- `features/dashboard/vehiculos/components/vehiculo-form/upload-adapter.ts` — deleted
- `features/dashboard/vehiculos/components/vehiculo-form/form.tsx` — remove adapter injection
- `features/dashboard/vehiculos/components/vehiculo-create-page.tsx` — remove adapter prop
- `features/dashboard/vehiculos/components/vehiculo-edit-page.tsx` — remove adapter prop

---

## Environment Variables

`.env` corrections required:

```env
AWS_BUCKET_NAME=cofalusados      # was: tu_bucket (placeholder)
AWS_REGION=us-east-2             # was: us-east-1 (wrong region)
```

No new variables needed — all S3 credentials are already present.

---

## Dependencies to Install

```bash
npm install @better-upload/server @better-upload/client
```

`@aws-sdk/client-s3` is a peer dependency of `@better-upload/server` — will be installed automatically.

---

## Error Handling

- File type mismatch → better-upload rejects at server route level (before upload)
- File too large → better-upload rejects at server route level
- S3 upload failure → `onError` callback → `toast.error`
- `addGaleriaImage` failure → existing error handling unchanged
- Unauthenticated request to `/api/upload` → `requireAdmin()` throws → 401

---

## Scalability Notes

- New entity types: add a route to `router.ts` + a key pattern to `keys.ts`
- No changes needed to `app/api/upload/route.ts` — router auto-picks up new routes
- `UPLOAD_ROUTES` constant keeps route names type-safe across all consumers
- Videos and documents routes are defined now but unused — zero cost, ready when needed
