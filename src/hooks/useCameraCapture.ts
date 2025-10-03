import { useRef, type ChangeEvent } from 'react'

interface UseCameraCaptureOptions {
  onCapture?: (file: File) => void | Promise<void>
}

export function useCameraCapture(options?: UseCameraCaptureOptions) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openCamera = () => {
    fileInputRef.current?.click()
  }

  const handleCapture = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (options?.onCapture) {
        await options.onCapture(file)
      }
      return file
    }
    return null
  }

  return {
    fileInputRef,
    openCamera,
    handleCapture
  }
}
