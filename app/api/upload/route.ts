import { toRouteHandler } from "@better-upload/server/adapters/next"
import { router } from "@/features/s3"

export const { POST } = toRouteHandler(router)
