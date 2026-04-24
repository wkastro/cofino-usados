import type { BlockDefinition } from "@/features/cms/types/block"

export interface VideoShowcaseContent {
  videoUrl:       string
  videoArchivoUrl: string
  coverImage:     string
  titulo:         string
  subtitulo:      string
}

export const videoShowcaseBlock: BlockDefinition<VideoShowcaseContent> = {
  key: "video-showcase",
  label: "Video Showcase",
  fields: [
    { key: "titulo",          label: "Título",                 type: "text"      },
    { key: "subtitulo",       label: "Subtítulo",              type: "textarea"  },
    { key: "videoUrl",        label: "URL de YouTube",         type: "url",      },
    { key: "videoArchivoUrl", label: "Video (subir archivo)",  type: "s3-video", s3Path: "detalle-vehiculo/video-showcase" },
    { key: "coverImage",      label: "Imagen de portada",      type: "s3-image", s3Path: "detalle-vehiculo/video-showcase", imageHint: "1920×1080 px (16:9)" },
  ],
  defaultValue: {
    videoUrl:        "",
    videoArchivoUrl: "",
    coverImage:      "/mechanic_video_cover.jpg",
    titulo:          "¿Porqué comprar con Cofiño Stahl?",
    subtitulo:       "Aprovechá descuentos exclusivos, financiamiento flexible y garantía certificada.",
  },
}
