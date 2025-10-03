import { useState, useEffect } from 'react'
import { type StoredImage, saveImage, getAllImages, updateImage, deleteImage } from '../lib/db'

export function useImageStorage() {
  const [images, setImages] = useState<StoredImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadImages = async () => {
    try {
      setLoading(true)
      const allImages = await getAllImages()
      setImages(allImages.sort((a, b) => b.timestamp - a.timestamp))
      setError(null)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadImages()
  }, [])

  const addImage = async (file: File, description?: string) => {
    try {
      const id = await saveImage({
        file,
        timestamp: Date.now(),
        description
      })
      await loadImages()
      return id
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const updateImageDescription = async (id: number, description: string) => {
    try {
      await updateImage(id, { description })
      await loadImages()
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const updateImageAudio = async (id: number, audioBlob: Blob) => {
    try {
      await updateImage(id, { audioBlob })
      await loadImages()
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const removeImage = async (id: number) => {
    try {
      await deleteImage(id)
      await loadImages()
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  return {
    images,
    loading,
    error,
    addImage,
    updateImageDescription,
    updateImageAudio,
    removeImage,
    refresh: loadImages
  }
}
