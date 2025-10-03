import { useRef, type ChangeEvent } from 'react'

export function useCameraCapture() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openCamera = () => {
    fileInputRef.current?.click()
  }

  const handleCapture = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log('Bilde tatt:', file)
      // TODO: Lagre bilde i IndexedDB
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
