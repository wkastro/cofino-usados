import type { BlockDefinition } from "@/features/cms/types/block"

export interface HeroContent {
  titulo: string
  subtitulo: string
  videoUrl: string
  posterUrl: string
}

export const heroBlock: BlockDefinition<HeroContent> = {
  key: "hero",
  label: "Hero Principal",
  fields: [
    { key: "titulo",    label: "Título",    type: "text",      required: true },
    { key: "subtitulo", label: "Subtítulo", type: "textarea"                  },
    { key: "videoUrl",  label: "Video",     type: "s3-video",  s3Path: "inicio/hero" },
    { key: "posterUrl", label: "Poster",    type: "s3-image",  s3Path: "inicio/hero", imageHint: "1920×1080 px (16:9)" },
  ],
  defaultValue: {
    titulo:    "",
    subtitulo: "",
    videoUrl:  "",
    posterUrl: "",
  },
}
