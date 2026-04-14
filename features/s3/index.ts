// features/s3/index.ts

export { buildPublicUrl } from "./keys"

/** Type-safe route name constants — use these instead of raw strings. */
export const UPLOAD_ROUTES = {
  vehiculoImages: "vehiculo-images",
  vehiculoVideos: "vehiculo-videos",
  vehiculoDocuments: "vehiculo-documents",
} as const

export type UploadRoute = (typeof UPLOAD_ROUTES)[keyof typeof UPLOAD_ROUTES]
