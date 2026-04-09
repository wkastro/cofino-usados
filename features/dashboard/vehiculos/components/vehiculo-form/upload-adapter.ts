export interface UploadAdapter {
  upload(file: File): Promise<{ url: string }>
}

/**
 * Current implementation: URL input only.
 * Swap for S3Adapter when ready — StepGaleria accepts any UploadAdapter.
 */
export class LocalUrlAdapter implements UploadAdapter {
  async upload(_file: File): Promise<{ url: string }> {
    throw new Error("LocalUrlAdapter does not support file uploads. Use URL input instead.")
  }
}

export const localUrlAdapter = new LocalUrlAdapter()
