import { NextRequest, NextResponse } from "next/server"
import { AwsClient } from "aws4fetch"
import { auth } from "@/auth"
import { generateKey } from "@/features/s3/keys"

type FileCategory = "images" | "videos" | "documents"

const ROUTE_CONFIG = {
  "vehiculo-images": {
    category: "images" as FileCategory,
    types: ["image/"],
    maxSize: 5 * 1024 * 1024,
    maxFiles: 10,
  },
  "vehiculo-videos": {
    category: "videos" as FileCategory,
    types: ["video/"],
    maxSize: 100 * 1024 * 1024,
    maxFiles: 3,
  },
  "vehiculo-documents": {
    category: "documents" as FileCategory,
    types: ["application/pdf", "text/"],
    maxSize: 20 * 1024 * 1024,
    maxFiles: 5,
  },
} as const

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const formData = await request.formData()
  const route = formData.get("route") as string | null
  const vehiculoId = formData.get("vehiculoId") as string | null
  const files = formData.getAll("files") as File[]

  if (!route || !(route in ROUTE_CONFIG)) {
    return NextResponse.json({ error: "Ruta de upload inválida" }, { status: 400 })
  }

  const config = ROUTE_CONFIG[route as keyof typeof ROUTE_CONFIG]

  if (!files.length) {
    return NextResponse.json({ error: "No se proporcionaron archivos" }, { status: 400 })
  }

  if (files.length > config.maxFiles) {
    return NextResponse.json(
      { error: `Máximo ${config.maxFiles} archivos por solicitud` },
      { status: 400 },
    )
  }

  for (const file of files) {
    const validType = config.types.some((t) => file.type.startsWith(t))
    if (!validType) {
      return NextResponse.json(
        { error: `Tipo de archivo no permitido: ${file.type}` },
        { status: 400 },
      )
    }
    if (file.size > config.maxSize) {
      return NextResponse.json(
        { error: `Archivo demasiado grande: ${file.name} (máx. ${config.maxSize / 1024 / 1024} MB)` },
        { status: 400 },
      )
    }
  }

  const aws = new AwsClient({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    region: process.env.AWS_REGION!,
    service: "s3",
  })

  const uploaded: Array<{ key: string; url: string; name: string }> = []

  for (const file of files) {
    const key = generateKey(config.category, "vehiculos", vehiculoId, file.name)
    const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    const buffer = await file.arrayBuffer()

    const response = await aws.fetch(s3Url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
        "Content-Length": String(file.size),
      },
      body: buffer,
    })

    if (!response.ok) {
      const text = await response.text()
      console.error(`S3 upload error for ${file.name}:`, response.status, text)
      return NextResponse.json(
        { error: `Error al subir ${file.name}` },
        { status: 502 },
      )
    }

    const publicUrl = `https://${process.env.NEXT_PUBLIC_AWS_BASE_URL}/${key}`
    uploaded.push({ key, url: publicUrl, name: file.name })
  }

  return NextResponse.json({ files: uploaded })
}
