type FileCategory = "images" | "videos" | "documents"
type EntityType = "vehiculos"

/**
 * Sanitizes a filename to be safe for use in an S3 key.
 * Replaces any character that is not alphanumeric, dot, dash, or underscore with a dash.
 */
function sanitize(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase()
}

/**
 * Generates an S3 object key.
 *
 * Pattern: {category}/{entity}/{entityId|"temp"}/{timestamp}-{sanitizedFilename}
 *
 * Examples:
 *   images/vehiculos/abc123/1714000000000-foto-frontal.jpg
 *   videos/vehiculos/abc123/1714000000000-video-tour.mp4
 *   documents/vehiculos/temp/1714000000000-ficha-tecnica.pdf
 */
export function generateKey(
  category: FileCategory,
  entity: EntityType,
  entityId: string | null,
  filename: string,
): string {
  const id = entityId ?? "temp"
  return `${category}/${entity}/${id}/${Date.now()}-${sanitize(filename)}`
}

/**
 * Builds the public HTTPS URL for an S3 object given its key.
 * Uses the AWS_BASE_URL environment variable (e.g. "cofalusados.s3.us-east-2.amazonaws.com").
 */
export function buildPublicUrl(key: string): string {
  return `https://${process.env.AWS_BASE_URL}/${key}`
}
