import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url:            `${siteUrl}/`,
      lastModified:   new Date(),
      changeFrequency: "daily",
      priority:        1,
    },
    {
      url:            `${siteUrl}/comprar`,
      lastModified:   new Date(),
      changeFrequency: "daily",
      priority:        0.9,
    },
    {
      url:            `${siteUrl}/test-drive`,
      lastModified:   new Date(),
      changeFrequency: "weekly",
      priority:        0.7,
    },
    {
      url:            `${siteUrl}/certificados`,
      lastModified:   new Date(),
      changeFrequency: "monthly",
      priority:        0.6,
    },
    {
      url:            `${siteUrl}/intercambiar`,
      lastModified:   new Date(),
      changeFrequency: "monthly",
      priority:        0.6,
    },
    {
      url:            `${siteUrl}/terminos-condiciones`,
      lastModified:   new Date(),
      changeFrequency: "yearly",
      priority:        0.3,
    },
  ]
}
