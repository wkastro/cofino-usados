import { AwsClient } from "aws4fetch"

/**
 * Extracts the S3 object key from a public URL.
 * URL format: https://{NEXT_PUBLIC_AWS_BASE_URL}/{key}
 */
export function extractKeyFromUrl(url: string): string | null {
  const base = process.env.NEXT_PUBLIC_AWS_BASE_URL
  if (!base) return null
  const prefix = `https://${base}/`
  if (!url.startsWith(prefix)) return null
  return url.slice(prefix.length)
}

/**
 * Deletes an object from S3 by its public URL.
 * Returns true if deleted successfully, false otherwise.
 */
export async function deleteS3Object(url: string): Promise<boolean> {
  const key = extractKeyFromUrl(url)
  if (!key) {
    console.error("[deleteS3Object] Could not extract key from URL:", url)
    return false
  }

  const aws = new AwsClient({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    region: process.env.AWS_REGION!,
    service: "s3",
  })

  const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

  try {
    const response = await aws.fetch(s3Url, { method: "DELETE" })
    if (!response.ok && response.status !== 204) {
      const text = await response.text()
      console.error("[deleteS3Object] S3 delete error:", response.status, text)
      return false
    }
    return true
  } catch (error) {
    console.error("[deleteS3Object] Fetch error:", error)
    return false
  }
}
