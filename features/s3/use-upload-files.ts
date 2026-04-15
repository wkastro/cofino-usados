"use client"

import { useState } from "react"

export interface UploadProgress {
  name: string
  progress: number
}

export interface UploadedFile {
  name: string
  objectInfo: { key: string; url: string }
}

export interface FailedFile {
  name: string
  error: Error
}

interface UseUploadFilesOptions {
  route: string
  onUploadComplete?: (result: { files: UploadedFile[] }) => void
  onUploadFail?: (result: { failedFiles: FailedFile[] }) => void
  onError?: (error: Error) => void
}

export function useUploadFiles({
  route,
  onUploadComplete,
  onUploadFail,
  onError,
}: UseUploadFilesOptions) {
  const [progresses, setProgresses] = useState<UploadProgress[]>([])
  const [isPending, setIsPending] = useState(false)

  async function upload(
    files: FileList | File[],
    options?: { metadata?: Record<string, string> },
  ) {
    const fileArray = Array.from(files)
    if (!fileArray.length) return

    setIsPending(true)
    setProgresses(fileArray.map((f) => ({ name: f.name, progress: 0 })))

    const formData = new FormData()
    formData.append("route", route)

    if (options?.metadata) {
      for (const [key, value] of Object.entries(options.metadata)) {
        formData.append(key, value)
      }
    }

    for (const file of fileArray) {
      formData.append("files", file)
    }

    try {
      // Use XHR to track upload progress to the server
      const result = await new Promise<{ files: Array<{ key: string; url: string; name: string }> }>(
        (resolve, reject) => {
          const xhr = new XMLHttpRequest()

          xhr.upload.onprogress = (e) => {
            if (!e.lengthComputable) return
            const progress = e.loaded / e.total
            setProgresses(fileArray.map((f) => ({ name: f.name, progress })))
          }

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                resolve(JSON.parse(xhr.responseText))
              } catch {
                reject(new Error("Respuesta inválida del servidor"))
              }
            } else {
              try {
                const body = JSON.parse(xhr.responseText)
                reject(new Error(body.error ?? `Error ${xhr.status}`))
              } catch {
                reject(new Error(`Error ${xhr.status}`))
              }
            }
          }

          xhr.onerror = () => reject(new Error("Error de red al subir el archivo"))
          xhr.open("POST", "/api/upload")
          xhr.send(formData)
        },
      )

      setProgresses(fileArray.map((f) => ({ name: f.name, progress: 1 })))

      const uploadedFiles: UploadedFile[] = result.files.map((f) => ({
        name: f.name,
        objectInfo: { key: f.key, url: f.url },
      }))

      onUploadComplete?.({ files: uploadedFiles })
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Error desconocido")
      const failedFiles: FailedFile[] = fileArray.map((f) => ({ name: f.name, error }))
      onUploadFail?.({ failedFiles })
      onError?.(error)
    } finally {
      setIsPending(false)
      setProgresses([])
    }
  }

  return { upload, progresses, isPending }
}
