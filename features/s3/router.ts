// features/s3/router.ts

import { route, type Router } from "@better-upload/server"
import { aws } from "@better-upload/server/clients"
import { auth } from "@/auth"
import { generateKey } from "./keys"

async function requireAdminSession() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("No autorizado")
  }
}

export const router: Router = {
  client: aws(),
  bucketName: process.env.AWS_BUCKET_NAME!,
  routes: {
    "vehiculo-images": route({
      fileTypes: ["image/*"],
      multipleFiles: true,
      maxFiles: 10,
      maxFileSize: 1024 * 1024 * 5, // 5 MB
      async onBeforeUpload({ metadata }) {
        await requireAdminSession()
        const vehiculoId = (metadata as Record<string, string> | undefined)?.vehiculoId ?? null
        return {
          generateObjectInfo: ({ file }) => ({
            key: generateKey("images", "vehiculos", vehiculoId, file.name),
          }),
        }
      },
    }),

    "vehiculo-videos": route({
      fileTypes: ["video/*"],
      multipleFiles: true,
      maxFiles: 3,
      maxFileSize: 1024 * 1024 * 100, // 100 MB
      async onBeforeUpload({ metadata }) {
        await requireAdminSession()
        const vehiculoId = (metadata as Record<string, string> | undefined)?.vehiculoId ?? null
        return {
          generateObjectInfo: ({ file }) => ({
            key: generateKey("videos", "vehiculos", vehiculoId, file.name),
          }),
        }
      },
    }),

    "vehiculo-documents": route({
      fileTypes: ["application/pdf", "text/*"],
      multipleFiles: true,
      maxFiles: 5,
      maxFileSize: 1024 * 1024 * 20, // 20 MB
      async onBeforeUpload({ metadata }) {
        await requireAdminSession()
        const vehiculoId = (metadata as Record<string, string> | undefined)?.vehiculoId ?? null
        return {
          generateObjectInfo: ({ file }) => ({
            key: generateKey("documents", "vehiculos", vehiculoId, file.name),
          }),
        }
      },
    }),
  },
}
